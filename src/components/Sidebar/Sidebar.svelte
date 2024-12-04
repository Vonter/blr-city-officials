<script lang="ts">
  import {
    isSelectingCoordinates,
    selectedBoundaryMap,
    selectedCoordinates,
    selectedDistrict,
    isListingBoundaryMaps
  } from '../../stores';
  import DefaultDetails from './DefaultDetails.svelte';
  import BoundaryDetails from './BoundaryDetails.svelte';
  import DistrictDetails from './DistrictDetails.svelte';
  import CoordinateDetails from './CoordinateDetails.svelte';
  import BoundaryList from './BoundaryList.svelte';
</script>

<nav
  id="sidebar"
  class="w-full h-1/2 md:h-full md:w-1/3 2xl:w-1/4 overflow-auto shadow-lg text-gray-900 dark:bg-neutral-900 dark:text-gray-100 flex flex-col"
>
  <div class="flex-1">
    {#if $selectedBoundaryMap && $selectedDistrict}
      <DistrictDetails />
    {:else if $selectedBoundaryMap && !$selectedDistrict}
      <BoundaryDetails />
    {:else if $isSelectingCoordinates || $selectedCoordinates}
      <CoordinateDetails />
    {:else if $isListingBoundaryMaps}
      <BoundaryList />
    {:else}
      <DefaultDetails />
    {/if}
  </div>
  <footer class="p-4 dark:bg-neutral-900 flex content-start">
    <a
      href="https://boundaries.beta.nyc"
      class="mt-0.5 ml-2 text-xs text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200 mr-auto"
    >
      Inspired by BetaNYC
    </a>
    <a
      class="mt-0.5 text-xs text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200"
      href="https://github.com/Vonter/blr-boundaries/blob/master/DATA.md"
      >Data</a
    >
    <a
      class="mt-0.5 ml-2 text-xs text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200"
      href="https://github.com/Vonter/blr-boundaries">Code</a
    >
  </footer>
</nav>
