<script lang="ts">
  import { run } from 'svelte/legacy';

  import {
    selectedBoundaryMap,
    selectedCoordinates,
    selectedDistrict
  } from './stores';
  import Map from './components/Map.svelte';
  import Sidebar from './components/Sidebar/Sidebar.svelte';
  import Controls from './components/Controls.svelte';

  const params = new URLSearchParams(window.location.search);

  run(() => {
    $selectedDistrict
      ? params.set('dist', $selectedDistrict)
      : params.delete('dist');

    $selectedBoundaryMap
      ? params.set('map', $selectedBoundaryMap)
      : params.delete('map');

    if ($selectedCoordinates) {
      params.set('lng', $selectedCoordinates.lng.toString());
      params.set('lat', $selectedCoordinates.lat.toString());
    } else {
      params.delete('lng');
      params.delete('lat');
    }

    window.history.replaceState({}, '', `${location.pathname}?${params}`);
  });
</script>

<main
  id="main"
  class="flex flex-col md:flex-row h-full absolute bottom-0 left-0 right-0 dark:bg-neutral-900"
>
  <Sidebar />
  <div class="relative flex-1 order-first md:order-last">
    <Map />
    <div
      class="md:absolute md:top-3 md:left-3 md:right-3 absolute bottom-0 left-0 right-0 p-3 pointer-events-none"
    >
      <div class="pointer-events-auto">
        <Controls />
      </div>
    </div>
  </div>
</main>

<style>
  /* On mobile, hide the attribution */
  @media (max-width: 768px) {
    :global(.maplibregl-ctrl.maplibregl-ctrl-attrib) {
      display: none;
    }
  }
</style>
