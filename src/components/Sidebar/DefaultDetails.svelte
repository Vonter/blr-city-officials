<script lang="ts">
  import { _, locale } from 'svelte-i18n';
  import { selectedBoundaryMap } from '../../stores';
  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';

  function toggleLanguage() {
    $locale = $locale?.startsWith('kn') ? 'en' : 'kn';
  }
</script>

<SidebarHeader title={$_('page_title')}>
  <button
    class="px-2 py-1 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none"
    on:click={toggleLanguage}
  >
    {$_('toggle_language')}
  </button>
</SidebarHeader>

<div class="py-4 dark:bg-neutral-900">
  <div class="text-gray-600 dark:text-gray-400 mb-4 px-4">
    {$_('introduction')}
  </div>
  {#each Object.entries(layers) as [key, value], index}
    <div
      class:bg-white={index % 2 === 0}
      class:dark:bg-neutral-900={index % 2 === 0}
      class:bg-gray-100={index % 2 !== 0}
      class:dark:bg-neutral-800={index % 2 !== 0}
    >
      <button
        on:click={() => selectedBoundaryMap.set(key)}
        class="block py-1 px-4 w-full text-left hover:bg-gray-200"
      >
        <span class="mr-1">
          {value.icon}
        </span>
        {$locale?.startsWith('kn') ? value.name_kn : value.name}
      </button>
    </div>
  {/each}
</div>
