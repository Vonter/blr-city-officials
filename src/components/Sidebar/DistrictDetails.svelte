<script lang="ts">
  import { run } from 'svelte/legacy';

  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    selectedCoordinates,
    isListingBoundaryMaps,
    mapStore,
    getOfficialDetails
  } from '../../stores';
  import { sortedDistricts, resetZoom } from '../../helpers/helpers';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import { debounce } from '../../helpers/debounce';

  let districtsIntersectingPolygon: Feature[];
  let isLoading = false;

  function getDistrictTitle(
    boundaryId: string | null,
    districtId: string | null
  ) {
    if (boundaryId && districtId) {
      return `${layers[boundaryId].icon} \u00A0 ${layers[boundaryId].name_long} ${layers[
        boundaryId
      ].formatContent(districtId)}`;
    }

    return 'Unknown District';
  }

  function handleBack() {
    resetZoom($mapStore);
    selectedDistrict.set(null);
    if ($selectedCoordinates) {
      selectedBoundaryMap.set(null);
    }
    if (!$isListingBoundaryMaps) {
      selectedBoundaryMap.set(null);
    }
  }
</script>

<SidebarHeader
  title={getDistrictTitle($selectedBoundaryMap, $selectedDistrict)}
  onBack={handleBack}
/>
<div class="py-4 dark:bg-neutral-900">
  {#if $selectedBoundaryMap}
    {#if $selectedDistrict}
      {#await getOfficialDetails($selectedBoundaryMap, $selectedDistrict) then official}
        {#if official}
          <div class="px-6 mt-4 pb-4">
            <div class="flex items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                Contact Details
              </h3>
              <a href={official.Source} target="_blank" rel="noopener noreferrer" class="ml-auto text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                Source
              </a>
            </div>

            <div class="bg-white dark:bg-neutral-800 p-4 space-y-4">
              {#if official.Designation && official.Designation !== '-'}
                <div class="flex flex-col">
                  <span class="text-sm text-gray-600 dark:text-gray-400 mb-1">Designation</span>
                  <span class="text-gray-900 dark:text-gray-100">{official.Designation}</span>
                </div>
              {/if}

              {#if official.Name && official.Name !== '-'}
                <div class="flex flex-col">
                  <span class="text-sm text-gray-600 dark:text-gray-400 mb-1">Name</span>
                  <span class="text-gray-900 dark:text-gray-100">{official.Name}</span>
                </div>
              {/if}

              <div class="flex flex-col">
                <span class="text-sm text-gray-600 dark:text-gray-400 mb-1">Contact</span>
                <div class="flex flex-wrap gap-2">
                  {#if official.Phone && typeof official.Phone === 'string'}
                    {#if official.Phone.includes(',')}
                      {#each official.Phone.split(',').map((p: string) => p.trim()) as phone}
                        <a href="tel:{phone}" class="inline-flex items-center px-3 py-1 text-sm md:text-base rounded bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {phone}
                        </a>
                      {/each}
                    {:else}
                      <a href="tel:{official.Phone}" class="inline-flex items-center px-3 py-1 text-sm md:text-base rounded bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {official.Phone}
                      </a>
                    {/if}
                  {/if}
                  {#if official['E-Mail']}
                    <a href="mailto:{official['E-Mail']}" class="inline-flex items-center px-3 py-1 text-sm md:text-base rounded bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {official['E-Mail']}
                    </a>
                  {/if}
                  {#if !official.Phone && !official['E-Mail']}
                    <span class="text-gray-500 dark:text-gray-400 italic">No contact information available</span>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {:else}
          <div class="px-6 mt-4 pb-4">
            <div class="bg-white dark:bg-neutral-800">
              <a href={layers[$selectedBoundaryMap].formatUrl($selectedDistrict)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                View official page
              </a>
            </div>
          </div>
        {/if}
      {/await}
    {/if}
  {/if}
</div>
