<script lang="ts">
  import { fromStore } from 'svelte/store';
  import { _ } from 'svelte-i18n';
  import { selectedBoundaryMap, selectedDepartmentGroup } from '../../stores';
  import { layers } from '../../assets/boundaries';
  import { getGroupKey } from '../../helpers/departmentGroup';
  import { alternatingRowClass } from '../../helpers/styleUtils';
  import SidebarHeader from './SidebarHeader.svelte';

  const t = fromStore(_);
  const deptGroup = fromStore(selectedDepartmentGroup);

  const groupKeys = $derived.by(() => {
    if (!deptGroup.current) return [];
    const prefix = deptGroup.current;
    return Object.keys(layers).filter(k => getGroupKey(k) === prefix);
  });

  const groupIcon = $derived(
    groupKeys.length > 0 && groupKeys[0] ? layers[groupKeys[0]].icon : ''
  );
  const groupNameKey = $derived(`group_${deptGroup.current}`);

  function handleBack() {
    selectedDepartmentGroup.set(null);
  }
</script>

<SidebarHeader
  title={`${groupIcon} \u00A0 ${t.current(groupNameKey)}`}
  onBack={handleBack}
/>

<div class="py-4 dark:bg-neutral-900">
  {#each groupKeys as key, index}
    <div class={alternatingRowClass(index)}>
      <button
        onclick={() => selectedBoundaryMap.set(key)}
        class="block py-1.5 px-4 w-full text-left font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700"
      >
        {t.current(layers[key]?.nameKey || '')}
      </button>
    </div>
  {/each}
</div>
