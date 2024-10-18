<script lang="ts">
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
  import {
    resetZoom,
    sortedDistricts,
    getDownloadableUrl
  } from '../../helpers/helpers';
  import DistrictLink from './DistrictLink.svelte';
  import Loader from '../Loader.svelte';
  import type { Feature } from 'geojson';
  import { toKML } from '@placemarkio/tokml';

  let value = '';
  let districts: Feature[] = [];
  let isLoading: boolean;
  let isDetailPaneOpen: boolean = false;
  let geojsonDownloadUrl: string = '';
  let kmlDownloadUrl: string = '';

  function onDistrictMouseOver(districtId: string) {
    if ($hoveredDistrictId && $selectedBoundaryMap) {
      $mapStore.setFeatureState(
        { source: 'boundaries', id: $hoveredDistrictId },
        { hover: false }
      );
    }

    $hoveredDistrictId = districtId;

    if ($selectedBoundaryMap) {
      $mapStore.setFeatureState(
        { source: 'boundaries', id: $hoveredDistrictId },
        { hover: true }
      );
    }
  }

  function onDistrictMouseOut(districtId: string) {
    if ($selectedBoundaryMap) {
      $mapStore.setFeatureState(
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
    const data = {
      type: 'FeatureCollection',
      features: $boundaries.features.filter(
        boundary => boundary.properties.id === boundaryId
      )
    };
    districts = sortedDistricts(data.features);
    geojsonDownloadUrl = getDownloadableUrl(data, true);
    kmlDownloadUrl = getDownloadableUrl(toKML(data), false);
  }

  $: if ($boundaries) {
    getDistricts($selectedBoundaryMap);
  }
</script>

<SidebarHeader
  title={$selectedBoundaryMap
    ? layers[$selectedBoundaryMap].name_long
    : 'Loading&hellip;'}
  onBack={handleBack}
>
  <div class="flex mt-2">
    <div class="relative flex-1">
      <input
        id="filter"
        placeholder="Filter"
        type="search"
        name="filter"
        bind:value
        autocomplete="off"
        class="block w-full py-1 px-3 pl-10 bg-gray-100 dark:hover:bg-white/20 rounded focus:outline-none focus:ring focus:ring-blue-500 dark:bg-neutral-700"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 absolute left-1.5 top-1.5"
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
    {#if $selectedBoundaryMap}
      <div class="relative" use:clickOutside={() => (isDetailPaneOpen = false)}>
        <button
          on:click={() => (isDetailPaneOpen = !isDetailPaneOpen)}
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
          <a
            href={geojsonDownloadUrl}
            download="{$selectedBoundaryMap}.geojson"
            class="flex items-center py-1 px-3 -ml-4 text-gray-400 dark:text-gray-400
                    hover:text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
            target="_blank"
            title="GeoJSON"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5 inline-block mr-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            GeoJSON
          </a>
          <a
            href={kmlDownloadUrl}
            download="{$selectedBoundaryMap}.kml"
            class="flex items-center py-1 px-3 -ml-4 text-gray-400 dark:text-gray-400
                    hover:text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
            target="_blank"
            title="KML"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5 inline-block mr-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            KML
          </a>
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
