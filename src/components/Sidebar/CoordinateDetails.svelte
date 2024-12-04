<script lang="ts">
  import { run } from 'svelte/legacy';

  import SidebarHeader from './SidebarHeader.svelte';
  import {
    mapStore,
    addressMarker,
    coordinatesMarker,
    isSelectingCoordinates,
    selectedCoordinates,
    boundaries
  } from '../../stores';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import type { LngLat } from 'maplibre-gl';
  import maplibregl from 'maplibre-gl';
  import { resetZoom } from '../../helpers/helpers';
  import PolygonLookup from 'polygon-lookup';

  let districtsIntersectingAddress: Feature[] = $state([]);
  let isLoading = $state(false);
  let lookup: Object | null = null;
  let isGettingLocation = $state(false);

  function queryAllDistrictsForCoordinates(lngLat: LngLat) {
    districtsIntersectingAddress = [];
    isLoading = true;
    if (!lookup) {
      lookup = new PolygonLookup($boundaries);
    }
    districtsIntersectingAddress = lookup.search(
      lngLat.lng,
      lngLat.lat,
      -1
    ).features;
    isLoading = false;
  }

  function getCoordinateTitle(lngLat: LngLat | null) {
    return lngLat ? `${lngLat.lat}, ${lngLat.lng}` : 'Search by location';
  }

  function handleBack() {
    selectedCoordinates.set(null);
    isSelectingCoordinates.set(false);
    if ($coordinatesMarker) $coordinatesMarker.remove();
    resetZoom($mapStore);
  }

  async function useCurrentLocation() {
    isGettingLocation = true;
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const lngLat = {
        lng: position.coords.longitude,
        lat: position.coords.latitude
      };

      selectedCoordinates.set(lngLat);
      isSelectingCoordinates.set(false);
    } catch (error) {
      console.error('Error getting location:', error);
      alert(
        'Unable to get current location. Please try again or select a location on the map instead.'
      );
    } finally {
      isGettingLocation = false;
    }
  }

  run(() => {
    if ($mapStore && $selectedCoordinates && $boundaries) {
      queryAllDistrictsForCoordinates($selectedCoordinates);
      $mapStore.flyTo({ center: $selectedCoordinates, zoom: 13 });

      if ($addressMarker) $addressMarker.remove();
      if ($coordinatesMarker) $coordinatesMarker.remove();
      $coordinatesMarker = new maplibregl.Marker({ color: '#2463eb' })
        .setLngLat($selectedCoordinates)
        .addTo($mapStore);
    }
  });

  run(() => {
    if ($mapStore) {
      if ($isSelectingCoordinates) {
        $mapStore.getCanvas().style.cursor = 'crosshair';

        $mapStore.once('click', e => {
          selectedCoordinates.set({
            lat: e.lngLat.lat.toFixed(5),
            lng: e.lngLat.lng.toFixed(5)
          });
          isSelectingCoordinates.set(false);
        });
      } else {
        $mapStore.getCanvas().style.cursor = '';
      }
    }
  });
</script>

<SidebarHeader
  title={getCoordinateTitle($selectedCoordinates)}
  onBack={handleBack}
/>
<div class="py-2">
  {#if !$selectedCoordinates}
    <div class="grid gap-3 px-4">
      <button
        class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-blue-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-gray-700 dark:text-gray-300 font-medium"
          >Select on map</span
        >
      </button>

      <button
        class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        on:click={useCurrentLocation}
        disabled={isGettingLocation}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-blue-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
          />
        </svg>
        <span class="text-gray-700 dark:text-gray-300 font-medium">
          {isGettingLocation ? 'Getting location...' : 'Use current location'}
        </span>
      </button>
    </div>
  {/if}
  {#if $selectedCoordinates}
    <OverlapList districts={districtsIntersectingAddress} {isLoading} />
  {/if}
</div>
