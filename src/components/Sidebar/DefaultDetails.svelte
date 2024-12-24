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

<SidebarHeader title="BLR City Officials" />

<div class="py-4 dark:bg-neutral-900">
  <div class="text-gray-600 dark:text-gray-400 mb-4 px-4">
    Select location on map, search by address or pick a boundary.
  </div>

  {#each Object.entries(groupedLayers) as [group, groupLayers]}
    {#each groupLayers as { key, value }, index}
      <div
        class={index % 2 === 0
          ? 'bg-white dark:bg-neutral-900'
          : 'bg-gray-100 dark:bg-neutral-800'}
      >
        <button
          on:click={() => selectedBoundaryMap.set(key)}
          class="block py-1 px-4 w-full text-left hover:bg-gray-200"
        >
          <span class="mr-1">
            {value.icon}
          </span>
          {value.name_long}
        </button>
      </div>
    {/each}
  {/each}
</div>
