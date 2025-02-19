<script lang="ts">
  import { run } from 'svelte/legacy';
  import { browser } from '$app/environment';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    selectedCoordinates,
    mapStore,
    hoveredDistrictId,
    boundaries,
    isMapReady,
    darkMode
  } from '../stores';
  import type { Feature } from 'geojson';
  import maplibregl from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { layers } from '../assets/boundaries';
  import turfBbox from '@turf/bbox';
  import { defaultZoom, findPolylabel, zoomToBound } from '../helpers/helpers';
  import { colors } from '../helpers/colors';

  let map: maplibregl.Map;
  let isSourceLoaded = $state(false);
  let prevLayerId: string | null = null;

  function initMap(container: any) {
    if (!browser) return;

    map = new maplibregl.Map({
      container,
      style: $darkMode
        ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      minZoom: 9,
      maxZoom: 16,
      maxBounds: [
        [77, 12.5], // Southwestern bounds + buffer
        [78.25, 13.5] // Northeastern bounds + buffer
      ],
      ...defaultZoom
    });

    // Add attribution control on top right for mobile
    const attributionControl = new maplibregl.AttributionControl();
    map.addControl(attributionControl, 'top-right');

    // Add full screen control on top left for mobile, bottom left for desktop
    const fullscreenControl = new maplibregl.FullscreenControl();
    map.addControl(fullscreenControl, 'top-left');
    map.addControl(fullscreenControl, 'bottom-left');

    // Override default browser zoom hotkeys
    window.addEventListener(
      'keydown',
      e => {
        if (e.metaKey && (e.key === '=' || e.key === '-')) {
          e.preventDefault();
          e.key === '=' && map.zoomIn();
          e.key === '-' && map.zoomOut();
        }
      },
      true
    );

    map.on('load', () => {
      $mapStore = map;
      map.resize();
      map.removeLayer('boundary_county');

      isMapReady.set(true);
    });

    map.on('click', e => {
      if (!$selectedBoundaryMap) {
        selectedCoordinates.set({
          lat: e.lngLat.lat.toFixed(5),
          lng: e.lngLat.lng.toFixed(5)
        });
      }
    });

    return {
      destroy: () => {
        map.remove();
        $mapStore = map;
      }
    };
  }

  function clearMap() {
    if ($mapStore && prevLayerId) {
      // Remove previous layers
      $mapStore.getLayer(`${prevLayerId}-layer`) &&
        $mapStore.removeLayer(`${prevLayerId}-layer`);

      $mapStore.getLayer(`${prevLayerId}-stroke-layer`) &&
        $mapStore.removeLayer(`${prevLayerId}-stroke-layer`);

      $mapStore.getLayer(`${prevLayerId}-label-layer`) &&
        $mapStore.removeLayer(`${prevLayerId}-label-layer`);
    }
  }

  async function loadMap() {
    // Load source if not already loaded
    if ($mapStore && !$mapStore.getSource('boundaries')) {
      $mapStore
        .addSource('boundaries', {
          type: 'geojson',
          promoteId: 'namecol',
          data: $boundaries
        })
        .addSource('boundaries-centerpoints', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: $boundaries.features.map((feature: Feature) => {
              return {
                ...feature,
                geometry: {
                  type: 'Point',
                  coordinates: findPolylabel(feature)
                }
              };
            })
          }
        });

      $mapStore.on('sourcedata', source => {
        if (source.sourceId === 'boundaries' && source.isSourceLoaded) {
          isSourceLoaded = true;
        }
      });
    }
  }

  async function showMap(boundaryId: string) {
    clearMap();

    if ($mapStore) {
      $mapStore
        .addLayer({
          id: `${boundaryId}-layer`,
          type: 'fill',
          source: 'boundaries',
          paint: {
            'fill-color': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              $darkMode ? colors['dark-default'] : colors['default'],
              $darkMode ? colors['dark-selected'] : colors['selected']
            ],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              $darkMode ? 0.2 : 0.4,
              $darkMode ? 0.01 : 0.05
            ]
          },
          filter: ['==', 'id', boundaryId]
        })
        .addLayer({
          id: `${boundaryId}-stroke-layer`,
          type: 'line',
          source: 'boundaries',
          paint: {
            'line-color': $darkMode
              ? colors['dark-default']
              : colors['default'],
            'line-width': [
              'case',
              [
                'any',
                ['boolean', ['feature-state', 'hover'], false],
                ['boolean', ['feature-state', 'selected'], false]
              ],
              2,
              1
            ]
          },
          filter: ['==', 'id', boundaryId]
        })
        .addLayer({
          id: `${boundaryId}-label-layer`,
          type: 'symbol',
          source: `boundaries-centerpoints`,
          paint: {
            'text-color': $darkMode
              ? colors['dark-default']
              : colors['default'],
            'text-halo-color': $darkMode
              ? 'rgba(0,0,0,0.4)'
              : 'rgba(255,255,255,0.9)',
            'text-halo-width': 2
          },
          layout: {
            'text-field': ['get', 'namecol'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 11, 12.5, 32, 60]
          },
          filter: ['==', 'id', boundaryId]
        });

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      $mapStore.on('mousemove', `${boundaryId}-layer`, e => {
        $mapStore.getCanvas().style.cursor = 'pointer';

        if (e.features) {
          if (e.features.length > 0) {
            if ($hoveredDistrictId !== null) {
              $mapStore?.setFeatureState(
                { source: 'boundaries', id: $hoveredDistrictId },
                { hover: false }
              );
            }
            $hoveredDistrictId = e.features[0].properties?.namecol;
            if ($hoveredDistrictId !== null) {
              $mapStore.setFeatureState(
                { source: 'boundaries', id: $hoveredDistrictId },
                { hover: true }
              );
            }
          }

          popup
            .setLngLat(e.lngLat)
            .setHTML(
              `<div class="flex items-center -mb-1"><div class="text-2xl mr-2">${
                layers[boundaryId].icon
              }</div><div class="pr-1"><div class="text-xs text-gray-500">${
                layers[boundaryId].name
              }</div><div class="text-sm font-semibold">${
                layers[boundaryId].e.features[0].properties?.namecol
              }</div></div></div>`
            )
            .setOffset(8)
            .addTo(map);
        }
      });

      $mapStore.on('mouseleave', `${boundaryId}-layer`, () => {
        $mapStore.getCanvas().style.cursor = '';

        if ($hoveredDistrictId !== null) {
          $mapStore.setFeatureState(
            { source: 'boundaries', id: $hoveredDistrictId },
            { hover: false }
          );
        }

        hoveredDistrictId.set(undefined);

        popup.remove();
      });

      $mapStore.on('click', `${boundaryId}-layer`, e => {
        if (e.features) {
          zoomToBound($mapStore, turfBbox(e.features[0]));
          onDistrictChange(e.features[0].properties?.namecol, true);
        }
      });
    }

    // Prepare for future boundary change
    prevLayerId = boundaryId;
  }

  function onDistrictChange(
    districtId: string | null,
    interactionFromClick: boolean = false
  ) {
    // Reset all selected states first
    if ($mapStore && $boundaries) {
      $boundaries.features.forEach(feature => {
        if (feature.properties?.namecol) {
          $mapStore.setFeatureState(
            { source: 'boundaries', id: feature.properties.namecol },
            { selected: false }
          );
        }
      });
    }

    $selectedDistrict = districtId;

    // Fetch bbox from districtId, fly to bbox.
    // If there interaction came from a click, it will fly in before the function.
    if ($mapStore && $selectedBoundaryMap && $selectedDistrict) {
      if (!interactionFromClick) {
        const feature = $boundaries?.features.filter(feature => {
          return (
            feature.properties?.namecol.toLowerCase() ===
              $selectedDistrict?.toLowerCase() &&
            feature.properties?.id.toLowerCase() ===
              $selectedBoundaryMap?.toLowerCase()
          );
        });
        if (feature && feature.length > 0) {
          const combinedBbox = turfBbox({
            type: 'FeatureCollection',
            features: feature
          });
          zoomToBound($mapStore, combinedBbox);
        }
      }

      // Set new selected state
      $mapStore.setFeatureState(
        { source: 'boundaries', id: $selectedDistrict },
        { selected: true }
      );
    }
  }

  run(() => {
    if ($isMapReady && $boundaries) {
      loadMap();
    }
  });

  run(() => {
    isSourceLoaded && $selectedBoundaryMap
      ? showMap($selectedBoundaryMap)
      : clearMap();
  });

  run(() => {
    isSourceLoaded && onDistrictChange($selectedDistrict);
  });
</script>

<div id="map" class="flex-1 h-full" use:initMap></div>
