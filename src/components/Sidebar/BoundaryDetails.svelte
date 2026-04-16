<script lang="ts">
  import { _, locale } from 'svelte-i18n';
  import { fromStore } from 'svelte/store';

  import type { Feature, FeatureCollection } from 'geojson';
  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';
  import BoundaryInformation from './BoundaryInformation.svelte';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    selectedDepartmentGroup,
    hoveredDistrictId,
    mapStore,
    departmentBoundaries,
    loadDepartmentBoundary,
    officialsData
  } from '../../stores';
  import { clickOutside } from 'svelte-use-click-outside';
  import {
    getOfficialDetails,
    getWardName,
    getBoundaryNumber,
    resetZoom,
    sortedDistricts,
    isRegionalLocale
  } from '../../helpers/helpers';
  import { alternatingRowClass } from '../../helpers/styleUtils';
  import { setHoverState } from '../../helpers/mapFeatureState';
  import DistrictLink from './DistrictLink.svelte';
  import Icon from '../Icon.svelte';
  import HierarchyBreadcrumb from './HierarchyBreadcrumb.svelte';
  import Loader from '../Loader.svelte';
  import ShareButton from '../ShareButton.svelte';
  import { api } from '../../helpers/api';

  const t = fromStore(_);
  const loc = fromStore(locale);
  const boundaryMap = fromStore(selectedBoundaryMap);
  const deptGroup = fromStore(selectedDepartmentGroup);
  const hoveredId = fromStore(hoveredDistrictId);
  const map = fromStore(mapStore);
  const deptBoundaries = fromStore(departmentBoundaries);
  const officials = fromStore(officialsData);

  let value = $state('');
  let districts: Feature[] = $state([]);
  let isLoading: boolean = $state(false);
  let isDetailPaneOpen: boolean = $state(false);
  let boundaryData: FeatureCollection | null = $state(null);

  function getSourceId() {
    return boundaryMap.current ? `boundaries-${boundaryMap.current}` : null;
  }

  function onDistrictMouseOver(districtId: string) {
    const sourceId = getSourceId();
    if (!sourceId) return;
    setHoverState(map.current, sourceId, hoveredId.current, false);
    hoveredId.current = districtId;
    setHoverState(map.current, sourceId, districtId, true);
  }

  function onDistrictMouseOut(districtId: string) {
    const sourceId = getSourceId();
    if (!sourceId) return;
    setHoverState(map.current, sourceId, districtId, false);
    hoveredId.current = undefined;
  }

  function handleBack() {
    selectedBoundaryMap.set(null);
    if (!deptGroup.current && map.current) {
      resetZoom(map.current);
    }
  }

  async function getDistricts(boundaryId: string) {
    isLoading = true;

    try {
      let deptData = deptBoundaries.current.get(boundaryId) ?? null;
      if (!deptData) {
        deptData = await loadDepartmentBoundary(boundaryId);
      }

      if (deptData) {
        boundaryData = deptData;
        districts = sortedDistricts(
          [...deptData.features],
          layers[boundaryId]?.sortBy
        );
      } else {
        const boundaryDetails = await api.getBoundaryDetails(boundaryId);

        if (boundaryDetails) {
          boundaryData = {
            type: 'FeatureCollection',
            features: []
          };
          districts = boundaryDetails.districts.map(
            (d: any) =>
              ({
                type: 'Feature',
                properties: {
                  id: boundaryId,
                  namecol: d.namecol,
                  wardName: d.wardName,
                  boundaryNumber: d.boundaryNumber
                },
                geometry: null
              }) as unknown as Feature
          );
        } else {
          console.error('Failed to get boundary details');
          boundaryData = null;
          districts = [];
        }
      }
    } catch (error) {
      console.error('Error getting boundary details:', error);
      boundaryData = null;
      districts = [];
    } finally {
      isLoading = false;
    }
  }

  $effect(() => {
    if (boundaryMap.current) {
      getDistricts(boundaryMap.current);
    }
  });

  function getRootDepartment(deptKey: string | null): string | null {
    if (!deptKey) return null;
    let current = deptKey;
    while (layers[current]?.parentDepartment) {
      current = layers[current]!.parentDepartment!;
    }
    return current;
  }

  function displayNameWithNumber(
    namecol: string,
    wardName: string,
    boundaryId: string | null,
    boundaryNumber?: string
  ): string {
    if (boundaryId && layers[boundaryId]?.showBoundaryNumber) {
      const num = getBoundaryNumber(namecol) || boundaryNumber;
      if (num) return `${num}: ${wardName}`;
    }
    return wardName;
  }

  interface DistrictEntry {
    namecol: string;
    wardName: string;
    boundaryNumber?: string;
  }

  function uniqueDistricts(
    features: Feature[],
    filter: string
  ): DistrictEntry[] {
    const seen = new Set<string>();
    const result: DistrictEntry[] = [];
    const lowerFilter = filter.toLowerCase();
    for (const f of features) {
      const namecol = f.properties?.['namecol'] || '';
      if (!namecol.toLowerCase().includes(lowerFilter)) continue;
      if (seen.has(namecol)) continue;
      seen.add(namecol);
      result.push({
        namecol,
        wardName: f.properties?.['wardName'] || namecol,
        boundaryNumber: f.properties?.['boundaryNumber'] || undefined
      });
    }
    return result;
  }
</script>

<SidebarHeader
  title={boundaryMap.current && layers[boundaryMap.current] && loc.current
    ? `${layers[boundaryMap.current].icon} \u00A0 ${t.current(layers[boundaryMap.current].nameKey)}`
    : 'Loading...'}
  onBack={handleBack}
>
  <div class="flex items-center">
    <ShareButton />
    {#if boundaryMap.current && layers[boundaryMap.current]}
      {@const rootDeptKey = getRootDepartment(boundaryMap.current)}
      <div class="relative" use:clickOutside={() => (isDetailPaneOpen = false)}>
        <button
          onclick={() => (isDetailPaneOpen = !isDetailPaneOpen)}
          aria-label="Show boundary information"
          class={`w-8 h-8 ml-2 text-lg flex justify-center items-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/20 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring focus:ring-blue-500 ${
            isDetailPaneOpen &&
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}
        >
          <Icon name="info" class="h-5 w-5" />
        </button>
        <div
          class={`absolute top-full mt-2 right-0 w-72 bg-white rounded shadow-md p-2 py-4 mb-4 text-gray-800 text-sm dark:text-gray-200 dark:bg-neutral-900 ${
            isDetailPaneOpen ? 'visible' : 'hidden'
          }`}
        >
          <div class="space-y-3">
            {#if rootDeptKey && rootDeptKey !== boundaryMap.current && layers[rootDeptKey]?.descriptionKey}
              {@const rootDescKey = layers[rootDeptKey].descriptionKey}
              {@const rootDesc = t.current(rootDescKey)}
              {#if rootDesc !== rootDescKey}
                <p class="text-gray-600 dark:text-gray-400">{rootDesc}</p>
              {/if}
            {/if}
            {#if boundaryMap.current && layers[boundaryMap.current]}
              {@const currentLayer = layers[boundaryMap.current]!}
              {#if currentLayer.descriptionKey && t.current(currentLayer.descriptionKey) !== currentLayer.descriptionKey}
                <p class="text-gray-600 dark:text-gray-400">
                  {t.current(currentLayer.descriptionKey)}
                </p>
              {:else if currentLayer.description}
                <p class="text-gray-600 dark:text-gray-400">
                  {currentLayer.description}
                </p>
              {/if}
            {/if}
          </div>
          {#if boundaryData}
            <BoundaryInformation filename={boundaryMap.current} />
          {/if}
        </div>
      </div>
    {/if}
  </div>
</SidebarHeader>
{#if boundaryMap.current}
  <HierarchyBreadcrumb departmentKey={boundaryMap.current} />
{/if}
<div class="py-2 dark:bg-neutral-900">
  {#if isLoading}
    <div class="px-4">
      <Loader />
    </div>
  {:else}
    <div class="relative flex-1 px-4 pb-2">
      <input
        id="filter"
        placeholder={t.current('filter_placeholder')}
        type="search"
        name="filter"
        bind:value
        autocomplete="off"
        class="block w-full py-1.5 px-3 pl-10 bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />
      <Icon name="search" class="h-5 w-5 absolute left-6 top-2" />
    </div>
    {#each uniqueDistricts(districts, value) as entry, index}
      {@const officialDetails = getOfficialDetails(
        boundaryMap.current,
        entry.namecol,
        officials.current
      )}
      {@const nameColRegional =
        officialDetails && officialDetails.length > 0 && officialDetails[0]?.AreaRegional
          ? getWardName(officialDetails[0].AreaRegional)
          : entry.wardName}
      <div class={alternatingRowClass(index)}>
        <DistrictLink
          onMouseOver={() => onDistrictMouseOver(entry.namecol)}
          onMouseOut={() => onDistrictMouseOut(entry.namecol)}
          onClick={() => selectedDistrict.set(entry.namecol)}
          icon={boundaryMap.current && layers[boundaryMap.current]?.icon
            ? layers[boundaryMap.current].icon
            : ''}
          nameCol={displayNameWithNumber(
            entry.namecol,
            isRegionalLocale(loc.current) ? nameColRegional : entry.wardName,
            boundaryMap.current,
            entry.boundaryNumber
          )}
          nameLong=""
        />
      </div>
    {/each}
  {/if}
</div>
