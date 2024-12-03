<script lang="ts">
  import {
    mapStore,
    selectedBoundaryMap,
    selectedDistrict,
    selectedCoordinates
  } from '../../stores';
  import { layers } from '../../assets/boundaries';
  import DistrictLink from './DistrictLink.svelte';
  import type { Feature } from 'geojson';

  import Loader from '../Loader.svelte';

  interface Props {
    districts: Feature[];
    isLoading: boolean;
  }

  let { districts, isLoading }: Props = $props();

  function showIntersectingDistrict(feature: Feature) {
    if (!$mapStore.getSource('intersecting-layer')) {
      $mapStore.addSource('intersecting-layer', {
        type: 'geojson',
        data: feature
      });

      $mapStore.addLayer({
        id: 'intersecting-layer',
        type: 'fill',
        source: 'intersecting-layer',
        paint: {
          'fill-color': '#dd2727',
          'fill-opacity': 0.2
        }
      });

      $mapStore.addLayer({
        id: 'intersecting-stroke-layer',
        type: 'line',
        source: 'intersecting-layer',
        paint: {
          'line-color': '#bc0000',
          'line-width': 2
        }
      });
    }
  }

  function hideIntersectingDistrict() {
    if ($mapStore.getSource('intersecting-layer')) {
      $mapStore
        .removeLayer('intersecting-layer')
        .removeLayer('intersecting-stroke-layer')
        .removeSource('intersecting-layer');
    }
  }
</script>

{#if isLoading || !districts}
  <div class="px-4">
    <Loader />
  </div>
{:else if districts.length === 0}
  <div class="px-4">
    Couldn't load any districts. {$selectedCoordinates &&
      'Make sure you select coordinates within BLR.'}
  </div>
{:else}
  {#each Object.entries(layers).filter(([key, _]) => key !== 'boundaries') as [key, value]}
    {#if districts.filter(district => district.properties?.id === key).length}
      <div class="mb-1 w-full">
        <div class="block text-sm text-gray-600 dark:text-gray-400 pt-1.5 px-4">
          {value.name_long}
        </div>
        <div class="w-full">
          {#each districts.filter(district => district.properties?.id === key) as district}
            <DistrictLink
              onMouseOver={() => showIntersectingDistrict(district)}
              onMouseOut={() => hideIntersectingDistrict()}
              onClick={() => {
                $selectedBoundaryMap = district.properties?.id;
                $selectedDistrict = district.properties?.namecol;
                hideIntersectingDistrict();
              }}
              icon={layers[district.properties?.id].icon}
              nameCol={district.properties?.namecol}
              area={district.properties?.area}
              searea={district.properties?.searea}
              formatContent={layers[district.properties?.id].formatContent}
              formatUrl={layers[district.properties?.id].formatUrl}
            />
          {/each}
        </div>
      </div>
    {/if}
  {/each}
{/if}
