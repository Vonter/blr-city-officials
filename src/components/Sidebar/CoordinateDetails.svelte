<script lang="ts">
  import { run } from 'svelte/legacy';

  import SidebarHeader from './SidebarHeader.svelte';
  import {
    mapStore,
    addressMarker,
    coordinatesMarker,
    selectedCoordinates,
    boundaries
  } from '../../stores';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import type { LngLat } from 'maplibre-gl';
  import maplibregl from 'maplibre-gl';
  import { resetZoom, getOfficialDetails } from '../../helpers/helpers';
  import PolygonLookup from 'polygon-lookup';
  import { api } from '../../helpers/api'; 
  import { _, locale } from 'svelte-i18n';
  import { layers } from '../../assets/boundaries';

  let districtsIntersectingAddress: Feature[] = $state([]);
  let isLoading = $state(false);
  let isCopied = $state(false);
  let lookup: Object | null = null;

  async function queryAllDistrictsForCoordinates(lngLat: LngLat) {
    districtsIntersectingAddress = [];
    isLoading = true;

    try {
      // Use TopoJSON if loaded
      if ($boundaries) {
        if (!lookup) {
          lookup = new PolygonLookup($boundaries);
        }
        const searchResults = lookup.search(lngLat.lng, lngLat.lat, -1);
        districtsIntersectingAddress = searchResults.features;
      } else {
        // Fallback to API if TopoJSON not loaded
        const coordinateDetails = await api.getCoordinateDetails(lngLat);

        if (coordinateDetails) {
          districtsIntersectingAddress = coordinateDetails.districts.map(
            (d: any) =>
              ({
                type: 'Feature',
                properties: d.properties,
                geometry: null
              }) as unknown as Feature
          );
        } else {
          console.error('Failed to get coordinate details');
          districtsIntersectingAddress = [];
        }
      }
    } catch (error) {
      console.error('Error getting coordinate details:', error);
      districtsIntersectingAddress = [];
    } finally {
      isLoading = false;
    }
  }

  function getCoordinateTitle(lngLat: LngLat | null) {
    return lngLat ? `${lngLat.lat}, ${lngLat.lng}` : 'Search by location';
  }

  function handleBack() {
    selectedCoordinates.set(null);
    if ($coordinatesMarker) $coordinatesMarker.remove();
    resetZoom($mapStore);
  }

  async function exportToCSV() {
    if (!$selectedCoordinates || !districtsIntersectingAddress) return;

    let csv = `${$_('latitude_longitude')};${$selectedCoordinates.lat},${$selectedCoordinates.lng}\n`;
    
    const sortedDistricts = districtsIntersectingAddress.sort((a, b) => {
      const aIndex = Object.keys(layers).indexOf(a.properties?.id);
      const bIndex = Object.keys(layers).indexOf(b.properties?.id);
      return aIndex - bIndex;
    });
      
    sortedDistricts.forEach(district => {
      const officialDetails = getOfficialDetails(district.properties?.id, district.properties?.namecol);
      const deptKey = `dept_${officialDetails[0].Department.toLowerCase()}`;
      const deptName = $_(deptKey);
      const areaName = $locale?.startsWith('kn') ? officialDetails[0].AreaKN : officialDetails[0].Area;
      csv += `${deptName};${areaName}\n`;
    });

    try {
      // Try modern clipboard API first (works in secure contexts)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(csv);
        isCopied = true;
        setTimeout(() => {
          isCopied = false;
        }, 2000);
      } else {
        // Fallback for mobile and non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = csv;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          textArea.remove();
          isCopied = true;
          setTimeout(() => {
            isCopied = false;
          }, 2000);
        } catch (err) {
          textArea.remove();
          console.error('Failed to copy text: ', err);
        }
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }

  run(() => {
    if ($mapStore && $selectedCoordinates) {
      queryAllDistrictsForCoordinates($selectedCoordinates);
      $mapStore.flyTo({ center: $selectedCoordinates, zoom: 13 });

      if ($addressMarker) $addressMarker.remove();
      if ($coordinatesMarker) $coordinatesMarker.remove();
      $coordinatesMarker = new maplibregl.Marker({ color: '#2463eb' })
        .setLngLat($selectedCoordinates)
        .addTo($mapStore);
    }
  });
</script>

<SidebarHeader
  title={getCoordinateTitle($selectedCoordinates)}
  onBack={handleBack}
>
  {#snippet children()}
    <button
      onclick={exportToCSV}
      aria-label="Copy to CSV"
      class={`w-8 h-8 ml-2 text-lg flex justify-center items-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/20 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring focus:ring-blue-500 ${
            isCopied &&
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}
      disabled={!districtsIntersectingAddress || districtsIntersectingAddress.length === 0}
    >
      {#if isCopied}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black dark:text-white"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M16 4h2a2 2 0 0 1 2 2v4"/><path d="M21 14H11"/><path d="m15 10-4 4 4 4"/></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M16 4h2a2 2 0 0 1 2 2v4"/><path d="M21 14H11"/><path d="m15 10-4 4 4 4"/></svg>
      {/if}
      {#if isCopied}
        <span class="absolute top-12 right-0 text-xs px-2 py-1 rounded shadow-lg">
          {$_('copied_to_clipboard')}
        </span>
      {/if}
    </button>
  {/snippet}
</SidebarHeader>
<div class="py-2">
  {#if $selectedCoordinates}
    <OverlapList districts={districtsIntersectingAddress} {isLoading} />
  {/if}
</div>
