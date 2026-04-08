<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { fromStore } from 'svelte/store';
  import {
    selectedBoundaryMap,
    selectedCoordinates,
    selectedDistrict,
    selectedDepartmentGroup,
    showCitySelector
  } from '../../stores';
  import DefaultDetails from './DefaultDetails.svelte';
  import DepartmentGroupDetails from './DepartmentGroupDetails.svelte';
  import BoundaryDetails from './BoundaryDetails.svelte';
  import DistrictDetails from './DistrictDetails.svelte';
  import CoordinateDetails from './CoordinateDetails.svelte';
  import CitySelectorSidebar from './CitySelectorSidebar.svelte';
  import { isAllCitiesMode, cityConfig } from '../../configs/config';

  const t = fromStore(_);
  const boundaryMap = fromStore(selectedBoundaryMap);
  const district = fromStore(selectedDistrict);
  const coordinates = fromStore(selectedCoordinates);
  const departmentGroup = fromStore(selectedDepartmentGroup);
  const citySelector = fromStore(showCitySelector);

  let sidebarEl: HTMLElement;

  $effect(() => {
    boundaryMap.current;
    district.current;
    coordinates.current;
    departmentGroup.current;
    citySelector.current;
    if (sidebarEl) {
      sidebarEl.scrollTop = 0;
    }
  });
</script>

<nav
  id="sidebar"
  bind:this={sidebarEl}
  class="w-full h-1/2 md:h-full md:w-1/3 overflow-auto shadow-lg text-gray-900 dark:bg-neutral-900 dark:text-gray-100 flex flex-col"
>
  <div class="flex-1">
    {#if isAllCitiesMode && citySelector.current}
      <CitySelectorSidebar />
    {:else if boundaryMap.current && district.current}
      <DistrictDetails />
    {:else if boundaryMap.current && !district.current}
      <BoundaryDetails />
    {:else if coordinates.current}
      <CoordinateDetails />
    {:else if departmentGroup.current}
      <DepartmentGroupDetails />
    {:else}
      <DefaultDetails />
    {/if}
  </div>
  <footer class="p-4 dark:bg-neutral-900 flex content-start">
    <a
      class="mt-0.5 ml-2 text-xs text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200"
      href="https://forms.gle/6rBZHs21szmXvxBx8"
      target="_blank"
    >
      {t.current('footer_feedback')}
    </a>
    <a
      class="mt-0.5 ml-2 text-xs text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200 mr-auto"
      href="https://github.com/Vonter/city-officials"
      target="_blank"
    >
      {t.current('footer_code')}
    </a>
    <a
      href="https://boundaries.beta.nyc"
      class="mt-0.5 text-xs text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200"
      target="_blank"
    >
      {t.current('footer_betanyc')}
    </a>
  </footer>
</nav>
