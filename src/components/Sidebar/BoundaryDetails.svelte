<script lang="ts">
  import { _, locale } from 'svelte-i18n';

  import { run } from 'svelte/legacy';
  import type { Feature, FeatureCollection } from 'geojson';
  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';
  import BoundaryInformation from './BoundaryInformation.svelte';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    hoveredDistrictId,
    mapStore,
    boundaries
  } from '../../stores';
  import { clickOutside } from 'svelte-use-click-outside';
  import {
    getOfficialDetails,
    resetZoom,
    sortedDistricts
  } from '../../helpers/helpers';
  import DistrictLink from './DistrictLink.svelte';
  import Loader from '../Loader.svelte';

  let value = $state('');
  let districts: Feature[] = $state([]);
  let isLoading: boolean = $state(false);
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
    if (!$boundaries || !$boundaries.features) return;
    isLoading = true;

    try {
      boundaryData = {
        type: 'FeatureCollection',
        features: $boundaries.features.filter(
          (boundary: Feature) => boundary.properties?.['id'] === boundaryId
        )
      };
      districts = sortedDistricts(boundaryData.features);
    } finally {
      isLoading = false;
    }
  }

  run(() => {
    if ($boundaries && $selectedBoundaryMap) {
      getDistricts($selectedBoundaryMap);
    }
  });
</script>

<SidebarHeader
  title={$selectedBoundaryMap && layers[$selectedBoundaryMap] && $locale
    ? `${layers[$selectedBoundaryMap].icon} \u00A0 ${$locale.startsWith('kn') ? layers[$selectedBoundaryMap].name_kn : layers[$selectedBoundaryMap].name}`
    : 'Loading...'}
  onBack={handleBack}
>
  <div>
    {#if $selectedBoundaryMap && layers[$selectedBoundaryMap]}
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
          class={`absolute top-full mt-2 right-0 w-72 bg-white rounded shadow-md p-2 py-4 mb-4 text-gray-800 text-sm dark:text-gray-200 dark:bg-neutral-900 ${
            isDetailPaneOpen ? 'visible' : 'hidden'
          }`}
        >
          {layers[$selectedBoundaryMap]?.description}
          {#if layers[$selectedBoundaryMap]?.description_url}
            <a
              href={layers[$selectedBoundaryMap].description_url}
              class="underline"
              target="_blank"
              rel="noreferrer">Learn more</a
            >
          {/if}
          {#if boundaryData}
            <BoundaryInformation
              data={boundaryData}
              filename={$selectedBoundaryMap}
            />
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
    <div class="relative flex-1 px-4 pb-2">
      <input
        id="filter"
        placeholder={$_('filter_placeholder')}
        type="search"
        name="filter"
        bind:value
        autocomplete="off"
        class="block w-full py-1.5 px-3 pl-10 bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 absolute left-6 top-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    {#each [...new Set(districts
          .filter(district => district.properties?.['namecol']
              ?.toLowerCase()
              ?.includes(value.toLowerCase()))
          .map(d => d.properties?.['namecol']))] as district, index}
      {@const officialDetails = getOfficialDetails(
        $selectedBoundaryMap,
        district
      )}
      {@const nameColKn = officialDetails
        ? officialDetails.AreaKN
        : district.properties?.['namecol']}
      <div
        class:bg-white={index % 2 === 0}
        class:dark:bg-neutral-900={index % 2 === 0}
        class:bg-gray-100={index % 2 !== 0}
        class:dark:bg-neutral-800={index % 2 !== 0}
      >
        <DistrictLink
          onMouseOver={() => onDistrictMouseOver(district)}
          onMouseOut={() => onDistrictMouseOut(district)}
          onClick={() => ($selectedDistrict = district)}
          icon={$selectedBoundaryMap && layers[$selectedBoundaryMap]?.icon
            ? layers[$selectedBoundaryMap].icon
            : ''}
          nameCol={$locale?.startsWith('kn') ? nameColKn : district}
          nameLong=""
        />
      </div>
    {/each}
  {/if}
</div>
