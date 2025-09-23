<script lang="ts">
  import { browser } from '$app/environment';
  import { _, locale } from 'svelte-i18n';
  import {
    mapStore,
    selectedBoundaryMap,
    selectedDistrict,
    darkMode
  } from '../../stores';
  import { layers } from '../../assets/boundaries';
  import DistrictLink from './DistrictLink.svelte';
  import type { Feature } from 'geojson';
  import { colors } from '../../helpers/colors';
  import { getOfficialDetails, isRegionalLocale } from '../../helpers/helpers';

  import Loader from '../Loader.svelte';

  interface Props {
    districts: Feature[];
    isLoading: boolean;
  }

  let { districts, isLoading }: Props = $props();

  function showIntersectingDistrict(feature: Feature) {
    if (!browser || !$mapStore || !$mapStore.getSource) return;

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
          'fill-color': $darkMode ? colors['dark-default'] : colors['default'],
          'fill-opacity': 0.2
        }
      });

      $mapStore.addLayer({
        id: 'intersecting-stroke-layer',
        type: 'line',
        source: 'intersecting-layer',
        paint: {
          'line-color': $darkMode ? colors['dark-default'] : colors['default'],
          'line-width': 2
        }
      });
    } else {
      const source = $mapStore.getSource('intersecting-layer');
      if (source && 'setData' in source) {
        (source as any).setData(feature);
      }
    }
  }

  function hideIntersectingDistrict() {
    if (!browser || !$mapStore || !$mapStore.getSource) return;

    if ($mapStore.getSource('intersecting-layer')) {
      $mapStore.removeLayer('intersecting-layer');
      $mapStore.removeLayer('intersecting-stroke-layer');
      $mapStore.removeSource('intersecting-layer');
    }
  }
</script>

{#if isLoading}
  <div class="py-2 dark:bg-neutral-900">
    <div class="px-4 text-gray-800 dark:text-gray-200">
      {$_('fetching_location_details')}
      <Loader />
    </div>
  </div>
{:else if districts.length === 0}
  <div class="py-2 dark:bg-neutral-900">
    <div class="px-4 text-gray-800 dark:text-gray-200">
      {$_('fetching_location_details')}
      <Loader />
    </div>
  </div>
{:else}
  {#each Object.entries(layers).filter(([key, _]) => key !== 'boundaries') as [key, value], index}
    {#if districts.filter(district => district.properties?.['id'] === key).length}
      <div class="divide-y divide-gray-100 dark:divide-neutral-700">
        {#each districts.filter(district => district.properties?.['id'] === key) as district}
          {@const officialDetails = getOfficialDetails(
            district.properties?.['id'],
            district.properties?.['namecol']
          )}
          {@const nameColKn =
            officialDetails && officialDetails.length > 0 && officialDetails[0]
              ? officialDetails[0].AreaKN
              : district.properties?.['namecol']}
          <div
            class:bg-white={index % 2 === 0}
            class:dark:bg-neutral-900={index % 2 === 0}
            class:bg-gray-100={index % 2 !== 0}
            class:dark:bg-neutral-800={index % 2 !== 0}
          >
            <DistrictLink
              onMouseOver={() => showIntersectingDistrict(district)}
              onMouseOut={() => hideIntersectingDistrict()}
              onClick={() => {
                $selectedBoundaryMap = district.properties?.['id'];
                $selectedDistrict = district.properties?.['namecol'];
                hideIntersectingDistrict();
              }}
              icon={(() => {
                const id = district.properties?.['id'];
                return id && typeof id === 'string' && id in layers
                  ? layers[id]?.icon || ''
                  : '';
              })()}
              nameCol={isRegionalLocale($locale)
                ? nameColKn
                : district.properties?.['namecol']}
              nameLong={$_(value.nameKey)}
            />
          </div>
        {/each}
      </div>
    {/if}
  {/each}
{/if}
