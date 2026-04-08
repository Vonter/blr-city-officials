<script lang="ts">
  import { browser } from '$app/environment';
  import { _, locale } from 'svelte-i18n';
  import { fromStore } from 'svelte/store';
  import {
    mapStore,
    selectedBoundaryMap,
    selectedDistrict,
    darkMode,
    officialsData
  } from '../../stores';
  import { layers } from '../../assets/boundaries';
  import type { Feature } from 'geojson';
  import {
    getOfficialDetails,
    getWardName,
    getWardNumber,
    isRegionalLocale
  } from '../../helpers/helpers';
  import { formatDistrictName } from '../../helpers/districtDisplay';
  import { getGroupKey } from '../../helpers/departmentGroup';
  import { alternatingRowClass } from '../../helpers/styleUtils';
  import { cityConfig } from '../../configs/config';
  import {
    createBoundaryLayerGroup,
    type MapLayerGroup
  } from '../../helpers/mapLayers';
  import { onDestroy } from 'svelte';

  import Loader from '../Loader.svelte';
  import Icon from '../Icon.svelte';

  const t = fromStore(_);
  const loc = fromStore(locale);
  const map = fromStore(mapStore);
  const dark = fromStore(darkMode);
  const officials = fromStore(officialsData);

  interface Props {
    districts: Feature[];
    isLoading: boolean;
  }

  let { districts, isLoading }: Props = $props();

  interface OverlapEntry {
    deptKey: string;
    district: Feature;
    namecol: string;
    nameCol: string;
    nameColRegional: string;
    icon: string;
    hierarchyDepth: number;
  }

  interface OverlapGroup {
    groupKey: string;
    groupNameKey: string;
    icon: string;
    entries: OverlapEntry[];
  }

  const hierarchyDepthCache = new Map<string, number>();
  function getHierarchyDepth(deptKey: string): number {
    if (hierarchyDepthCache.has(deptKey))
      return hierarchyDepthCache.get(deptKey)!;
    let depth = 0;
    let current = deptKey;
    while (layers[current]?.parentDepartment) {
      depth++;
      current = layers[current]!.parentDepartment!;
    }
    hierarchyDepthCache.set(deptKey, depth);
    return depth;
  }

  const groupedDistricts = $derived.by(() => {
    const layerKeys = Object.keys(layers);
    const districtById = new Map<string, Feature[]>();
    for (const d of districts) {
      const id = d.properties?.['id'];
      if (id) {
        if (!districtById.has(id)) districtById.set(id, []);
        districtById.get(id)!.push(d);
      }
    }

    const allGroupSizes = new Map<string, string[]>();
    for (const key of layerKeys) {
      const gk = getGroupKey(key);
      if (!allGroupSizes.has(gk)) allGroupSizes.set(gk, []);
      allGroupSizes.get(gk)!.push(key);
    }

    const groupMap = new Map<string, OverlapGroup>();

    for (const key of layerKeys) {
      const matching = districtById.get(key);
      if (!matching || matching.length === 0) continue;

      const groupKey = getGroupKey(key);
      const groupKeysAll = allGroupSizes.get(groupKey) || [];
      const isSingleDeptGroup = groupKeysAll.length === 1;

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          groupKey,
          groupNameKey:
            isSingleDeptGroup && groupKeysAll[0]
              ? layers[groupKeysAll[0]]?.nameKey || `group_${groupKey}`
              : `group_${groupKey}`,
          icon: layers[key]?.icon || '',
          entries: []
        });
      }

      const group = groupMap.get(groupKey)!;
      for (const district of matching) {
        const officialDetails = getOfficialDetails(
          district.properties?.['id'],
          district.properties?.['namecol'],
          officials.current
        );
        const namecol = district.properties?.['namecol'] || '';
        const wardName =
          district.properties?.['wardName'] || getWardName(namecol);
        const wardNumber =
          district.properties?.['wardNumber'] || getWardNumber(namecol);
        const displayName = formatDistrictName(wardName, wardNumber);
        const nameColRegional =
          officialDetails && officialDetails.length > 0 && officialDetails[0]
            ? getWardName(officialDetails[0].AreaRegional)
            : wardName;
        const displayRegional = formatDistrictName(
          nameColRegional || '',
          wardNumber
        );

        group.entries.push({
          deptKey: key,
          district,
          namecol,
          nameCol: displayName,
          nameColRegional: displayRegional,
          icon: layers[key]?.icon || '',
          hierarchyDepth: getHierarchyDepth(key)
        });
      }
    }

    for (const group of groupMap.values()) {
      group.entries.sort((a, b) => b.hierarchyDepth - a.hierarchyDepth);
    }

    return [...groupMap.values()];
  });

  let layerGroup: MapLayerGroup | null = null;

  $effect(() => {
    const deptKey = cityConfig.overlapRenderDepartment;
    if (!browser || !map.current || !deptKey || districts.length === 0) return;

    const features = districts.filter(
      d => d.properties?.['id'] === deptKey && d.geometry
    );
    if (features.length === 0) return;

    if (!layerGroup) {
      layerGroup = createBoundaryLayerGroup(map.current, 'overlap');
    }
    layerGroup.render(features, deptKey, dark.current);
  });

  function handleEntryClick(entry: OverlapEntry) {
    layerGroup?.remove();
    layerGroup = null;
    selectedBoundaryMap.set(entry.deptKey);
    selectedDistrict.set(entry.namecol);
  }

  onDestroy(() => {
    layerGroup?.remove();
    layerGroup = null;
  });
</script>

{#if isLoading}
  <div class="py-2 dark:bg-neutral-900">
    <div class="px-4 text-gray-800 dark:text-gray-200">
      {t.current('fetching_location_details')}
      <Loader />
    </div>
  </div>
{:else if districts.length === 0}
  <div class="py-2 dark:bg-neutral-900">
    <div class="px-4 text-gray-800 dark:text-gray-200">
      {t.current('fetching_location_details')}
      <Loader />
    </div>
  </div>
{:else}
  <div>
    {#each groupedDistricts as group, groupIndex}
      <div class="pt-3 px-4 {alternatingRowClass(groupIndex)}">
        <div class="flex items-center gap-2 mb-2">
          <span>{group.icon}</span>
          <span class="text-sm font-medium text-gray-900 dark:text-gray-100"
            >{t.current(group.groupNameKey)}</span
          >
        </div>

        <div class="mt-0.5">
          {#each group.entries as entry}
            <button
              class="group/entry w-full text-left px-4 py-1.5 flex items-center gap-3
                     hover:bg-gray-200 dark:hover:bg-white/10
                     focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-500"
              onclick={() => handleEntryClick(entry)}
              aria-label={`View details for ${entry.nameCol}`}
            >
              <div class="min-w-0 flex-1">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {t.current(layers[entry.deptKey]?.nameKey || '')}
                </div>
                <div
                  class="text-sm text-gray-900 dark:text-gray-100 truncate group-hover/entry:underline"
                >
                  {isRegionalLocale(loc.current)
                    ? entry.nameColRegional
                    : entry.nameCol}
                </div>
              </div>
              <Icon
                name="chevron-right"
                class="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0 opacity-0 group-hover/entry:opacity-100 transition-opacity"
              />
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}
