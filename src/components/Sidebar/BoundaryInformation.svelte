<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { layers } from '../../assets/boundaries';

  export let filename: string;

  // Add type guard to ensure layers[filename] exists
  $: layerInfo = layers[filename as keyof typeof layers];
</script>

<div
  class="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 shadow-sm"
>
  {#if layerInfo}
    <div class="space-y-3">
      {#if layerInfo?.geodata_url}
        <a
          href={layerInfo.geodata_url}
          class="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group"
          target="_blank"
          rel="noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
          <span class="group-hover:underline"
            >{$_('information_source_url')}</span
          >
        </a>
      {/if}
    </div>
  {/if}
</div>
