<script lang="ts">
  import { _, locale } from 'svelte-i18n';
  import { fromStore } from 'svelte/store';
  import { layers } from '../../assets/boundaries';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    allBoundaries,
    officialsData
  } from '../../stores';
  import { findParentBoundaryName } from '../../helpers/spatial';
  import { getLocalizedDistrictName } from '../../helpers/districtDisplay';
  import type { FeatureCollection, Feature } from 'geojson';

  const boundaries = fromStore(allBoundaries);
  const officials = fromStore(officialsData);
  const t = fromStore(_);
  const loc = fromStore(locale);

  interface Props {
    departmentKey: string;
    districtName?: string | null;
  }

  let { departmentKey, districtName = null }: Props = $props();

  let resolvedNames: Map<string, string> = $state(new Map());

  $effect(() => {
    if (!districtName || !boundaries.current) {
      resolvedNames = new Map();
      return;
    }

    const boundariesData = boundaries.current as FeatureCollection;
    const districtFeatures = boundariesData.features.filter(
      (f: Feature) =>
        f.properties?.['id'] === departmentKey &&
        f.properties?.['namecol'] === districtName
    );

    if (districtFeatures.length === 0) {
      resolvedNames = new Map();
      return;
    }

    const names = new Map<string, string>();
    let parentKey = layers[departmentKey]?.parentDepartment;
    while (parentKey && layers[parentKey]) {
      const parentFeatures = boundariesData.features.filter(
        (f: Feature) => f.properties?.['id'] === parentKey
      );
      const parentName = findParentBoundaryName(
        districtFeatures[0]!,
        parentFeatures
      );
      if (parentName) {
        names.set(parentKey!, parentName);
      }
      parentKey = layers[parentKey!]?.parentDepartment;
    }
    resolvedNames = names;
  });

  function getDisplayName(key: string, districtId: string | null): string {
    if (!districtId) return '';
    return getLocalizedDistrictName(
      key,
      districtId,
      officials.current,
      loc.current
    );
  }

  const breadcrumbs = $derived.by(() => {
    const trail: Array<{
      key: string;
      nameKey: string;
      resolvedName?: string;
    }> = [];
    let current = departmentKey;
    while (current && layers[current]) {
      const layer = layers[current]!;
      const resolved = resolvedNames.get(current);
      trail.unshift({
        key: current,
        nameKey: layer.nameKey,
        resolvedName: resolved
      });
      current = layer.parentDepartment || '';
    }
    if (!districtName) {
      // Find the root of the hierarchy
      let root = departmentKey;
      while (
        layers[root]?.parentDepartment &&
        layers[layers[root]!.parentDepartment!]
      ) {
        root = layers[root]!.parentDepartment!;
      }
      // BFS to collect all departments in the hierarchy tree
      const allKeys: string[] = [];
      const queue = [root];
      while (queue.length > 0) {
        const key = queue.shift()!;
        allKeys.push(key);
        const children = layers[key]?.childDepartments || [];
        for (const childKey of children) {
          if (childKey && layers[childKey]) {
            queue.push(childKey);
          }
        }
      }
      // Rebuild trail with all hierarchy members, preserving resolved names
      trail.length = 0;
      for (const key of allKeys) {
        const resolved = resolvedNames.get(key);
        trail.push({
          key,
          nameKey: layers[key]!.nameKey,
          resolvedName: resolved
        });
      }
    } else {
      // When a district is selected, exclude the current department level
      // since the district name is shown as the final breadcrumb item
      return trail.filter(c => c.key !== departmentKey);
    }
    return trail;
  });
</script>

{#if breadcrumbs.length > 1 || (districtName && breadcrumbs.length > 0)}
  <div
    class="flex flex-wrap items-center gap-1 px-4 py-2 text-xs text-gray-500 dark:text-gray-400"
  >
    {#each breadcrumbs as crumb, i}
      {#if i > 0}
        <span class="mx-0.5 text-gray-300 dark:text-gray-600">›</span>
      {/if}
      {#if crumb.key === departmentKey && !districtName}
        <span class="font-medium text-gray-700 dark:text-gray-200"
          >{t.current(crumb.nameKey)}</span
        >
      {:else}
        <button
          class="hover:text-gray-700 dark:hover:text-gray-200 hover:underline"
          onclick={() => {
            if (crumb.resolvedName) {
              selectedBoundaryMap.set(crumb.key);
              selectedDistrict.set(crumb.resolvedName);
            } else {
              selectedDistrict.set(null);
              selectedBoundaryMap.set(crumb.key);
            }
          }}
          >{crumb.resolvedName
            ? getDisplayName(crumb.key, crumb.resolvedName)
            : t.current(crumb.nameKey)}</button
        >
      {/if}
    {/each}
    {#if districtName}
      <span class="mx-0.5 text-gray-300 dark:text-gray-600">›</span>
      <span class="font-medium text-gray-700 dark:text-gray-200"
        >{getDisplayName(departmentKey, districtName)}</span
      >
    {/if}
  </div>
{/if}
