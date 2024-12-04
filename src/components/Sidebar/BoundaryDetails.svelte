<script lang="ts">
  import { run } from 'svelte/legacy';
  import type { Feature, FeatureCollection } from 'geojson';
  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    hoveredDistrictId,
    mapStore,
    boundaries
  } from '../../stores';
  import { clickOutside } from 'svelte-use-click-outside';
  import { resetZoom, sortedDistricts } from '../../helpers/helpers';
  import DistrictLink from './DistrictLink.svelte';
  import Loader from '../Loader.svelte';
  import DownloadButtons from './DownloadButtons.svelte';

  let value = $state('');
  let districts: Feature[] = $state([]);
  let isLoading: boolean;
  let isDetailPaneOpen: boolean = $state(false);
  let boundaryData: FeatureCollection | null = $state(null);

  function onDistrictMouseOver(districtId: string) {
    if ($hoveredDistrictId && $selectedBoundaryMap) {
      $mapStore?.setFeatureState(
        { source: 'boundaries', id: $hoveredDistrictId },
        { hover: false }
      );
    }

    $hoveredDistrictId = districtId;

    if ($selectedBoundaryMap) {
      $mapStore?.setFeatureState(
        { source: 'boundaries', id: $hoveredDistrictId },
        { hover: true }
      );
    }
  }

  function onDistrictMouseOut(districtId: string) {
    if ($selectedBoundaryMap) {
      $mapStore?.setFeatureState(
        { source: 'boundaries', id: districtId },
        { hover: false }
      );
    }
    $hoveredDistrictId = undefined;
  }

  function handleBack() {
    selectedBoundaryMap.set(null);
    resetZoom($mapStore);
  }

  function getDistricts(boundaryId: string) {
    if (!$boundaries) return;

    boundaryData = {
      type: 'FeatureCollection',
      features: $boundaries.features.filter(
        (boundary: Feature) => boundary.properties?.id === boundaryId
      )
    };
    districts = sortedDistricts(boundaryData.features);
  }

  run(() => {
    if ($boundaries && $selectedBoundaryMap) {
      getDistricts($selectedBoundaryMap);
    }
  });
</script>

<SidebarHeader
  title={$selectedBoundaryMap
    ? `${layers[$selectedBoundaryMap].icon} \u00A0 ${layers[$selectedBoundaryMap].name_long}`
    : 'Loading&hellip;'}
  onBack={handleBack}
>
  <div>
    {#if $selectedBoundaryMap}
      <div class="relative" use:clickOutside={() => (isDetailPaneOpen = false)}>
        <button
          onclick={() => (isDetailPaneOpen = !isDetailPaneOpen)}
          aria-label="Show boundary information"
          class={`w-8 h-8 ml-2 text-lg flex justify-center items-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/20 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring focus:ring-blue-500 ${
            isDetailPaneOpen &&
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <div
          class={`absolute top-full mt-2 right-0 w-72 bg-white rounded shadow-md p-2 py-4 mb-4 px-4 text-gray-800 text-sm dark:text-gray-200 dark:bg-neutral-900 ${
            isDetailPaneOpen ? 'visible' : 'hidden'
          }`}
        >
          {layers[$selectedBoundaryMap].description}
          {#if layers[$selectedBoundaryMap].description_url}
            <a
              href={layers[$selectedBoundaryMap].description_url}
              class="underline"
              target="_blank"
              rel="noreferrer">Learn more</a
            >
          {/if}
          {#if boundaryData}
            {#await import('./DownloadButtons.svelte') then DownloadButtonsModule}
              <DownloadButtonsModule.default
                data={boundaryData}
                filename={$selectedBoundaryMap}
              />
            {/await}
          {/if}
        </div>
      </div>
    {/if}
  </div>
</SidebarHeader>
<div class="py-2 dark:bg-neutral-900">
  {#if isLoading}
    <div class="px-4">
      <Loader />
    </div>
  {:else}
    {#each districts.filter(district => district.properties?.namecol
        .toLowerCase()
        .includes(value.toLowerCase())) as district}
      <DistrictLink
        onMouseOver={() => onDistrictMouseOver(district.properties?.namecol)}
        onMouseOut={() => onDistrictMouseOut(district.properties?.namecol)}
        onClick={() => ($selectedDistrict = district.properties?.namecol)}
        icon={layers[district.properties?.id].icon}
        nameCol={district.properties?.namecol}
        formatContent={layers[district.properties?.id].formatContent}
        formatUrl={layers[district.properties?.id].formatUrl}
      />
    {/each}
  {/if}
</div>
