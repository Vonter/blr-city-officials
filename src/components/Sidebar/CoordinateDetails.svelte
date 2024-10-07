<script lang="ts">
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    mapStore,
    addressMarker,
    coordinatesMarker,
    isSelectingCoordinates,
    selectedCoordinates
  } from '../../stores';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import type { LngLat } from 'maplibre-gl';
  import maplibregl from 'maplibre-gl';
  import { resetZoom } from '../../helpers/helpers';

  let districtsIntersectingAddress: Feature[];
  let isLoading = false;

  async function queryAllDistrictsForCoordinates(lngLat: LngLat) {
    districtsIntersectingAddress = [];
    isLoading = true;
    const intersectsUrl = `./boundaries/${boundaryId}.topojson`;
    await fetch(intersectsUrl)
      .then(res => res.json())
      .then(({ features }) => {
        isLoading = false;
        districtsIntersectingAddress = features;
      });
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

  $: if ($mapStore && $selectedCoordinates) {
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
        selectedCoordinates.set(e.lngLat);
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
<div class="py-2">
  {#if $selectedCoordinates}
    <!--
    <OverlapList districts={districtsIntersectingAddress} {isLoading} />
-->
  {/if}
</div>
