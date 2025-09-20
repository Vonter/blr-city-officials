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
  import { layers } from '../../assets/boundaries';
  import { locale } from 'svelte-i18n';

  let districtsIntersectingAddress: Feature[] = $state([]);
  let isLoading = $state(false);
  let lookup: Object | null = null;
  let copyButtonText = $state('Copy');

  function queryAllDistrictsForCoordinates(lngLat: LngLat) {
    districtsIntersectingAddress = [];
    isLoading = true;
    if (!lookup) {
      lookup = new PolygonLookup($boundaries);
    }
    districtsIntersectingAddress = lookup.search(
      lngLat.lng,
      lngLat.lat,
      -1
    ).features;
    isLoading = false;
  }

  function getCoordinateTitle(lngLat: LngLat | null) {
    return lngLat ? `${lngLat.lat}, ${lngLat.lng}` : 'Search by location';
  }

  function handleBack() {
    selectedCoordinates.set(null);
    if ($coordinatesMarker) $coordinatesMarker.remove();
    resetZoom($mapStore);
  }

  function exportToCSV() {
    if (!$selectedCoordinates || !districtsIntersectingAddress) return;

    // Start with lat long - use appropriate language
    const latLongLabel = $locale?.startsWith('kn') ? 'ಅಕ್ಷಾಂಶ ರೇಖಾಂಶ' : 'Lat Long';
    let csv = `${latLongLabel},${$selectedCoordinates.lat} ${$selectedCoordinates.lng}\n`;
    
    // Iterate through layers in the same order as defined in the layers object
    // This matches the display order in OverlapList.svelte
    Object.entries(layers).forEach(([key, value]) => {
      // Skip the 'boundaries' key if it exists
      if (key === 'boundaries') return;
      
      // Find districts matching this layer type
      const matchingDistricts = districtsIntersectingAddress.filter(
        district => district.properties?.id === key
      );
      
      // Add each matching district
      matchingDistricts.forEach(district => {
        const areaNameEn = district.properties?.namecol;
        if (areaNameEn) {
          // Get the department name in the appropriate language
          const deptName = $locale?.startsWith('kn') ? value.name_kn : value.name;
          
          // Get the area name in the appropriate language
          let areaName = areaNameEn;
          if ($locale?.startsWith('kn')) {
            // Try to get Kannada name from officials data
            const officialDetails = getOfficialDetails(key, areaNameEn);
            if (officialDetails && officialDetails.length > 0 && officialDetails[0].AreaKN) {
              areaName = officialDetails[0].AreaKN;
            }
          }
          
          // Escape field if it contains comma
          const escapedArea = areaName.includes(',') ? `"${areaName}"` : areaName;
          csv += `${deptName},${escapedArea}\n`;
        }
      });
    });

    // Copy to clipboard
    navigator.clipboard.writeText(csv).then(() => {
      copyButtonText = 'Copied!';
      setTimeout(() => {
        copyButtonText = 'Copy';
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  }

  run(() => {
    if ($mapStore && $selectedCoordinates && $boundaries) {
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
      disabled={!districtsIntersectingAddress || districtsIntersectingAddress.length === 0}
      class="ml-auto px-2 py-0.5 text-xs rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      title="Copy jurisdictions as CSV"
    >
      {#if copyButtonText === 'Copied!'}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
      {/if}
      {copyButtonText}
    </button>
  {/snippet}
</SidebarHeader>
<div class="py-2">
  {#if $selectedCoordinates}
    <OverlapList districts={districtsIntersectingAddress} {isLoading} />
  {/if}
</div>
