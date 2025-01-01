<script lang="ts">
  import { addMessages, init } from 'svelte-i18n';
  import {
    selectedBoundaryMap,
    selectedCoordinates,
    selectedDistrict
  } from '../stores';
  import Map from '../components/Map.svelte';
  import Sidebar from '../components/Sidebar/Sidebar.svelte';
  import Controls from '../components/Controls.svelte';
  import en from '../assets/locales/en.json';
  import kn from '../assets/locales/kn.json';
  import type { PageData } from './$types';
  import { page } from '$app/state';
  import { browser } from '$app/environment';

  export let data: PageData;

  addMessages('en', en);
  addMessages('kn', kn);
  init({
    fallbackLocale: 'en',
    initialLocale: data.initialLocale
  });

  $: if (browser) {
    const url = new URL(page.url);

    if ($selectedDistrict) url.searchParams.set('dist', $selectedDistrict);
    else url.searchParams.delete('dist');

    if ($selectedBoundaryMap) url.searchParams.set('map', $selectedBoundaryMap);
    else url.searchParams.delete('map');

    if ($selectedCoordinates) {
      url.searchParams.set('lng', $selectedCoordinates.lng.toString());
      url.searchParams.set('lat', $selectedCoordinates.lat.toString());
    } else {
      url.searchParams.delete('lng');
      url.searchParams.delete('lat');
    }

    history.replaceState({}, '', url);
  }
</script>

<main
  class="flex flex-col md:flex-row h-full absolute inset-0 dark:bg-neutral-900"
>
  <Sidebar />
  <div class="relative flex-1 order-first md:order-last">
    <Map />
    <div
      class="md:absolute md:inset-x-3 md:top-3 absolute inset-x-0 bottom-0 p-3 pointer-events-none"
    >
      <div class="pointer-events-auto">
        <Controls />
      </div>
    </div>
  </div>
</main>

<style>
  @media (max-width: 768px) {
    :global(.maplibregl-ctrl-bottom-right),
    :global(.maplibregl-ctrl-bottom-left) {
      display: none;
    }
  }

  @media (min-width: 768px) {
    :global(.maplibregl-ctrl-top-right),
    :global(.maplibregl-ctrl-top-left) {
      display: none;
    }
  }

  :global(.maplibregl-ctrl-fullscreen .maplibregl-ctrl-icon) {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0YjU1NjMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1heGltaXplLTIiPjxwb2x5bGluZSBwb2ludHM9IjE1IDMgMjEgMyAyMSA5Ii8+PHBvbHlsaW5lIHBvaW50cz0iOSAyMSAzIDIxIDMgMTUiLz48bGluZSB4MT0iMjEiIHgyPSIxNCIgeTE9IjMiIHkyPSIxMCIvPjxsaW5lIHgxPSIzIiB4Mj0iMTAiIHkxPSIyMSIgeTI9IjE0Ii8+PC9zdmc+') !important;
  }
</style>
