<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { layers } from '../../assets/boundaries';

  interface Props {
    filename: string;
  }

  let { filename }: Props = $props();

  const layerInfo = $derived(layers[filename as keyof typeof layers]);

  const sourceUrl = $derived.by(() => {
    if (layerInfo?.geodata_url) return layerInfo.geodata_url;
    let current = layerInfo?.parentDepartment;
    while (current) {
      const parent = layers[current];
      if (parent?.geodata_url) return parent.geodata_url;
      current = parent?.parentDepartment;
    }
    return '';
  });
</script>

<div class="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
  {#if layerInfo}
    <div class="space-y-3">
      {#if sourceUrl}
        <a
          href={sourceUrl}
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
