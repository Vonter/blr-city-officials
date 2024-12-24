<script lang="ts">
  import { run } from 'svelte/legacy';

  import SidebarHeader from './SidebarHeader.svelte';
  import {
    mapStore,
    addressMarker,
    coordinatesMarker,
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
    if ($coordinatesMarker) $coordinatesMarker.remove();
    resetZoom($mapStore);
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
</script>

<SidebarHeader
  title={getCoordinateTitle($selectedCoordinates)}
  onBack={handleBack}
/>
<div class="py-2">
  {#if $selectedCoordinates}
    <OverlapList districts={districtsIntersectingAddress} {isLoading} />
  {/if}
</div>
