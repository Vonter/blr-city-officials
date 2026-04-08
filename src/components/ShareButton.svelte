<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { fromStore } from 'svelte/store';
  import { browser } from '$app/environment';
  import { get } from 'svelte/store';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    selectedCoordinates
  } from '../stores';
  import Icon from './Icon.svelte';

  const t = fromStore(_);

  interface Props {
    title?: string;
  }

  let { title = '' }: Props = $props();

  let showCopied = $state(false);

  function buildShareUrl(): string {
    const url = new URL(window.location.origin + window.location.pathname);
    const dist = get(selectedDistrict);
    const map = get(selectedBoundaryMap);
    const coords = get(selectedCoordinates);

    if (map) url.searchParams.set('map', map);
    if (dist) url.searchParams.set('dist', dist);
    if (coords) {
      url.searchParams.set('lng', coords.lng.toString());
      url.searchParams.set('lat', coords.lat.toString());
    }

    return url.toString();
  }

  async function handleShare() {
    if (!browser) return;

    const url = buildShareUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: title || document.title,
          url
        });
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          await copyToClipboard(url);
        }
      }
    } else {
      await copyToClipboard(url);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      showCopied = true;
      setTimeout(() => {
        showCopied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }
</script>

<button
  onclick={handleShare}
  aria-label={t.current('share')}
  class={`w-8 h-8 ml-2 text-lg flex justify-center items-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/20 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring focus:ring-blue-500 ${
    showCopied &&
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }`}
>
  {#if showCopied}
    <Icon name="check-filled" class="h-5 w-5 text-black dark:text-white" />
  {:else}
    <Icon name="share" class="h-5 w-5" />
  {/if}
  {#if showCopied}
    <span
      class="absolute top-12 right-0 text-xs px-2 py-1 rounded shadow-lg bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200"
    >
      {t.current('link_copied')}
    </span>
  {/if}
</button>
