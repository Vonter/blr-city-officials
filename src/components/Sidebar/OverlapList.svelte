<script lang="ts">
  import {
    mapStore,
    selectedBoundaryMap,
    selectedDistrict,
    selectedCoordinates,
    getOfficialDetails
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
            {@const official = getOfficialDetails(district.properties?.id, district.properties?.namecol)} 
            <div class="border-t border-gray-100 dark:border-neutral-700 first:border-t-0">
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
              {#if official}
                <div class="px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border-b border-gray-100 dark:border-neutral-700">
                  <div class="flex flex-col">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{official.Name}</span>
                      <span class="text-xs text-gray-600 dark:text-gray-400">{official.Designation}</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      {#if official.Phone && typeof official.Phone === 'string'}
                        {#if official.Phone.includes(',')}
                          {#each official.Phone.split(',').map((p: string) => p.trim()) as phone}
                            <a href="tel:{phone}" class="inline-flex items-center px-2 py-0.5 text-xs rounded bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              {phone}
                            </a>
                          {/each}
                        {:else}
                          <a href="tel:{official.Phone}" class="inline-flex items-center px-2 py-0.5 text-xs rounded bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {official.Phone}
                          </a>
                        {/if}
                      {/if}
                      <a href="mailto:{official['E-Mail']}" class="inline-flex items-center px-2 py-0.5 text-xs rounded bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {official['E-Mail']}
                      </a>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
            <hr class="border-t border-gray-100 dark:border-neutral-700" />
          {/each}
        </div>
      </div>
    {/if}
  {/each}
{/if}
