<script lang="ts">
  import { _ } from 'svelte-i18n';
  import {
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
  class="w-full h-1/2 md:h-full md:w-1/4 2xl:w-1/5 overflow-auto shadow-lg text-gray-900 dark:bg-neutral-900 dark:text-gray-100 flex flex-col"
>
  <div class="flex-1">
    {#if $selectedBoundaryMap && $selectedDistrict}
      <DistrictDetails />
    {:else if $selectedBoundaryMap && !$selectedDistrict}
      <BoundaryDetails />
    {:else if $selectedCoordinates}
      <CoordinateDetails />
    {:else}
      <DefaultDetails />
    {/if}
  </div>
  <footer class="p-4 dark:bg-neutral-900 flex content-start">
    <a
      class="mt-0.5 ml-2 text-xs text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200"
      href="https://docs.google.com/spreadsheets/d/1lsXt4nXsz9k52bW79KxSLRK3Lg30z8U9AcuPNUHUVNY/edit"
      target="_blank"
    >
      {$_('footer_data')}
    </a>
    <a
      class="mt-0.5 ml-2 text-xs text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200 mr-auto"
      href="https://github.com/Vonter/blr-city-officials"
      target="_blank"
    >
      {$_('footer_code')}
    </a>
    <a
      href="https://boundaries.beta.nyc"
      class="mt-0.5 text-xs text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200"
      target="_blank"
    >
      {$_('footer_betanyc')}
    </a>
  </footer>
</nav>
