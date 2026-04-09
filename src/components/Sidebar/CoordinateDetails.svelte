<script lang="ts">
  import { untrack } from 'svelte';
  import { fromStore } from 'svelte/store';
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    mapStore,
    addressMarker,
    coordinatesMarker,
    selectedCoordinates,
    allBoundaries
  } from '../../stores';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import type { LngLat } from 'maplibre-gl';
  import maplibregl from 'maplibre-gl';
  import { resetZoom } from '../../helpers/helpers';
  import PolygonLookup from 'polygon-lookup';
  import { api } from '../../helpers/api';
  import ShareButton from '../ShareButton.svelte';

  const coords$ = fromStore(selectedCoordinates);
  const map$ = fromStore(mapStore);
  const addrMarker$ = fromStore(addressMarker);
  const coordMarker$ = fromStore(coordinatesMarker);
  const boundaries$ = fromStore(allBoundaries);

  let districtsIntersectingAddress: Feature[] = $state([]);
  let isLoading = $state(false);
  let lookup: any = null;

  let prevAllBoundariesRef: any = null;

  async function queryAllDistrictsForCoordinates(lngLat: LngLat) {
    districtsIntersectingAddress = [];
    isLoading = true;

    try {
      // Use monolithic allBoundaries if loaded (from background prefetch)
      if (boundaries$.current) {
        // Rebuild lookup if allBoundaries changed
        if (boundaries$.current !== prevAllBoundariesRef) {
          lookup = new PolygonLookup(boundaries$.current);
          prevAllBoundariesRef = boundaries$.current;
        }
        const searchResults = lookup.search(lngLat.lng, lngLat.lat, -1);
        districtsIntersectingAddress = searchResults.features;
      } else {
        // Fallback to API if all boundaries not yet loaded
        const coordinateDetails = await api.getCoordinateDetails(lngLat);

        if (coordinateDetails) {
          districtsIntersectingAddress = coordinateDetails.districts.map(
            (d: any) =>
              ({
                type: 'Feature',
                properties: {
                  id: d.id,
                  namecol: d.namecol,
                  wardName: d.wardName,
                  boundaryNumber: d.boundaryNumber
                },
                geometry: null
              }) as unknown as Feature
          );
        } else {
          console.error('Failed to get coordinate details');
          districtsIntersectingAddress = [];
        }
      }
    } catch (error) {
      console.error('Error getting coordinate details:', error);
      districtsIntersectingAddress = [];
    } finally {
      isLoading = false;
    }
  }

  function getCoordinateTitle(lngLat: LngLat | null) {
    return lngLat ? `${lngLat.lat}, ${lngLat.lng}` : 'Search by location';
  }

  function handleBack() {
    selectedCoordinates.set(null);
    if (coordMarker$.current) coordMarker$.current.remove();
    if (map$.current) {
      resetZoom(map$.current);
    }
  }

  let lastCoordKey = '';

  $effect(() => {
    const coords = coords$.current;
    if (!coords) return;

    const coordKey = `${coords.lat},${coords.lng}`;
    if (coordKey === lastCoordKey) return;
    lastCoordKey = coordKey;

    untrack(() => {
      queryAllDistrictsForCoordinates(coords);
    });
  });

  $effect(() => {
    const coords = coords$.current;
    const map = map$.current;
    if (!map || !coords) return;

    untrack(() => {
      map.flyTo({ center: coords, zoom: 15, duration: 1500 });

      if (addrMarker$.current) addrMarker$.current.remove();
      if (coordMarker$.current) coordMarker$.current.remove();
      coordMarker$.current = new maplibregl.Marker({ color: '#2463eb' })
        .setLngLat(coords)
        .addTo(map);
    });
  });
</script>

<SidebarHeader title={getCoordinateTitle(coords$.current)} onBack={handleBack}>
  {#snippet children()}
    <ShareButton title={getCoordinateTitle(coords$.current)} />
  {/snippet}
</SidebarHeader>
<div class="py-2">
  {#if coords$.current}
    <OverlapList districts={districtsIntersectingAddress} {isLoading} />
  {/if}
</div>
