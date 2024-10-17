<script lang="ts">
  import maplibregl from 'maplibre-gl';
  import { onMount } from 'svelte';
  import {
    mapStore,
    addressMarker,
    coordinatesMarker,
    selectedBoundaryMap,
    isMapReady,
    selectedDistrict,
    selectedCoordinates,
    isSelectingCoordinates
  } from '../stores';

  let value: string;

  onMount(() => {
    const unsubscribe = isMapReady.subscribe(ready => {
      if (ready) {
        initializeMarkers();
      }
    });

    return unsubscribe;
  });

  function initializeMarkers() {
    if ($selectedCoordinates) {
      $coordinatesMarker = new maplibregl.Marker({ color: '#2463eb' })
        .setLngLat($selectedCoordinates)
        .addTo($mapStore);
    }
  }

  function onChange(e) {
    if (e && $isMapReady) {
      selectedCoordinates.set(null);
      selectedBoundaryMap.set(null);
      selectedDistrict.set(null);

      $mapStore.flyTo({ center: e.coords, zoom: 13 });

      if ($addressMarker) $addressMarker.remove();
      if ($coordinatesMarker) $coordinatesMarker.remove();
      $addressMarker = new maplibregl.Marker({ color: '#2463eb' })
        .setLngLat(e.coords)
        .addTo($mapStore);
    }
  }

  function onCoordinateButtonClick() {
    selectedCoordinates.set(null);
    selectedDistrict.set(null);
    selectedBoundaryMap.set(null);
    isSelectingCoordinates.set(!$isSelectingCoordinates);
  }
</script>

<div class="relative flex w-full justify-end">
  <button
    on:click={onCoordinateButtonClick}
    class={`group w-10 h-10 flex items-center justify-center ${
      $isSelectingCoordinates
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-white text-gray-600 hover:text-blue-600'
    } shadow-md rounded ml-2  hover:text-focus:outline-none focus:ring focus:ring-blue-500`}
    aria-label="Pick coordinates"
  >
    <div
      class="invisible group-hover:visible absolute top-full right-0 mt-2 bg-black text-gray-100 rounded shadow-md px-2 py-0.5"
    >
      Pick coordinates
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
</div>
