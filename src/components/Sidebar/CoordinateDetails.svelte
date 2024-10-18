<script lang="ts">
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

  let districtsIntersectingAddress: Feature[];
  let isLoading = false;
  let lookup: Object | null = null;

  function queryAllDistrictsForCoordinates(lngLat: LngLat) {
    districtsIntersectingAddress = [];
    console.log(lngLat);
    isLoading = true;
    console.log($boundaries);
    lookup = new PolygonLookup($boundaries);
    console.log(lookup);
    districtsIntersectingAddress = lookup.search(
      lngLat.lng,
      lngLat.lat,
      -1
    ).features;
    console.log(lookup.search(lngLat.lng, lngLat.lat, -1));
    console.log(districtsIntersectingAddress);
    isLoading = false;
  }

  function getCoordinateTitle(lngLat: LngLat | null) {
    return lngLat ? `${lngLat.lng}, ${lngLat.lat}` : 'Click a point on the map';
  }

  function handleBack() {
    selectedCoordinates.set(null);
    isSelectingCoordinates.set(false);
    if ($coordinatesMarker) $coordinatesMarker.remove();
    resetZoom($mapStore);
  }

  $: if ($mapStore && $selectedCoordinates && $boundaries) {
    queryAllDistrictsForCoordinates($selectedCoordinates);
    $mapStore.flyTo({ center: $selectedCoordinates, zoom: 13 });

    if ($addressMarker) $addressMarker.remove();
    if ($coordinatesMarker) $coordinatesMarker.remove();
    $coordinatesMarker = new maplibregl.Marker({ color: '#2463eb' })
      .setLngLat($selectedCoordinates)
      .addTo($mapStore);
  }

  $: if ($mapStore) {
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
</script>

<SidebarHeader
  title={getCoordinateTitle($selectedCoordinates)}
  onBack={handleBack}
/>
<div class="py-2 dark:bg-neutral-900">
  {#if $selectedCoordinates}
    <OverlapList districts={districtsIntersectingAddress} {isLoading} />
  {/if}
</div>
