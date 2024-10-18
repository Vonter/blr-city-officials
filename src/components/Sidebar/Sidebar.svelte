<script lang="ts">
  import {
    isSelectingCoordinates,
    selectedBoundaryMap,
    selectedCoordinates,
    selectedDistrict
  } from '../../stores';
  import DefaultDetails from './DefaultDetails.svelte';
  import BoundaryDetails from './BoundaryDetails.svelte';
  import DistrictDetails from './DistrictDetails.svelte';
  import CoordinateDetails from './CoordinateDetails.svelte';
</script>

<nav
  id="sidebar"
  class="w-full md:w-1/3 2xl:w-1/4 max-h-screen overflow-y-auto shadow-lg text-gray-900 flex flex-col"
>
  <div class="flex-1">
    {#if $selectedBoundaryMap && $selectedDistrict}
      <DistrictDetails />
    {:else if $selectedBoundaryMap && !$selectedDistrict}
      <BoundaryDetails />
    {:else if $isSelectingCoordinates || $selectedCoordinates}
      <CoordinateDetails />
    {:else}
      <DefaultDetails />
    {/if}
  </div>
  <footer class="p-4 flex content-start">
    <a
      href="https://boundaries.beta.nyc"
      class="mt-0.5 ml-2 text-xs text-gray-500 underline hover:text-gray-700 mr-auto"
    >
      Based on BetaNYC's Map
    </a>
    <a
      class="mt-0.5 text-xs text-gray-500 underline hover:text-gray-700"
      href="https://github.com/Vonter/blr-boundaries/blob/master/LICENSE"
      >License</a
    >
    <a
      class="mt-0.5 ml-2 text-xs text-gray-500 underline hover:text-gray-700"
      href="https://github.com/Vonter/blr-boundaries">Github</a
    >
  </footer>
</nav>
