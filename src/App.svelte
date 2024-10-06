<script lang="ts">
  import {
    selectedBoundaryMap,
    selectedCoordinates,
    selectedDistrict
  } from './stores';
  import Map from './components/Map.svelte';
  import Sidebar from './components/Sidebar/Sidebar.svelte';

  const params = new URLSearchParams(window.location.search);

  $: {
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
  }
</script>

<main
  id="main"
  class="flex flex-col md:flex-row h-full absolute bottom-0 left-0 right-0"
>
  <Sidebar />
  <div class="relative flex-1 order-first md:order-last">
    <Map />
  </div>
</main>
