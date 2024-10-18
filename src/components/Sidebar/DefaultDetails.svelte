<script lang="ts">
  import { selectedBoundaryMap } from '../../stores';
  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';

  type LayerGroup = {
    key: string;
    value: (typeof layers)[keyof typeof layers];
  }[];
  type GroupedLayers = Record<string, LayerGroup>;

  let groupedLayers = Object.entries(layers).reduce<GroupedLayers>(
    (acc, [key, value]) => {
      const group = value.group;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push({ key, value });
      return acc;
    },
    {}
  );
</script>

<SidebarHeader title="BLR Boundaries" />

<div class="p-4 grid gap-6 dark:bg-neutral-900">
  {#each Object.entries(groupedLayers) as [group, groupLayers]}
    <div class="grid grid-cols-3 gap-4 items-start">
      <h3
        class="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap pt-2"
      >
        <span class="mr-2">{groupLayers[0].value.icon}</span>
        <span>{group}</span>
      </h3>
      {#each groupLayers as { key, value }}
        <button
          on:click={() => selectedBoundaryMap.set(key)}
          class="flex items-center justify-center px-2 w-fit-12 h-8 text-sm font-medium rounded-md border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover-bg-white/20 hover:border-gray-400 dark:hover-bg-white/40 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <span>{value.name}</span>
        </button>
      {/each}
    </div>
  {/each}
</div>
