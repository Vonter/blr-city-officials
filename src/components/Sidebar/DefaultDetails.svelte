<script lang="ts">
  import {
    isListingBoundaryMaps,
    isSelectingCoordinates,
    selectedCoordinates,
    selectedDistrict,
    selectedBoundaryMap
  } from '../../stores';
  import SidebarHeader from './SidebarHeader.svelte';

  function focusSearchInput() {
    const searchInput = document.querySelector(
      '#search-autocomplete'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  function onCoordinateButtonClick() {
    selectedCoordinates.set(null);
    selectedDistrict.set(null);
    selectedBoundaryMap.set(null);
    isSelectingCoordinates.set(true);
  }
</script>

<div class="p-6 dark:bg-neutral-900">
  <div class="prose dark:prose-invert max-w-none">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
      BLR Boundaries
    </h2>

    <p class="text-gray-600 dark:text-gray-300 mb-8">
      Find your local BBMP ward, BESCOM division, BWSSB service station, Police
      station and more.
    </p>

    <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
      Search by:
    </h3>

    <div class="grid gap-3 mb-8">
      <button
        on:click={onCoordinateButtonClick}
        class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-blue-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-gray-700 dark:text-gray-300 font-medium"
          >Location</span
        >
      </button>

      <button
        on:click={focusSearchInput}
        class="flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-blue-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-gray-700 dark:text-gray-300 font-medium">Name</span>
      </button>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">
        Or explore:
      </h3>

      <button
        on:click={() => isListingBoundaryMaps.set(true)}
        class="flex items-center gap-3 w-full px-4 py-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-blue-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-gray-700 dark:text-gray-300 font-medium"
          >All boundaries</span
        >
      </button>
    </div>
  </div>
</div>
