<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
  import { page } from '$app/stores';
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

  addMessages('en', en);
  addMessages('kn', kn);
  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator()
  });

  onMount(() => {
    if (browser) {
      const params = $page.url.searchParams;

      if (params.has('dist')) {
        selectedDistrict.set(params.get('dist'));
      }
      if (params.has('map')) {
        selectedBoundaryMap.set(params.get('map'));
      }
      if (params.has('lng') && params.has('lat')) {
        selectedCoordinates.set({
          lng: parseFloat(params.get('lng')),
          lat: parseFloat(params.get('lat'))
        });
      }
    }
  });

  $: if (browser) {
    const params = new URLSearchParams();
    if ($selectedDistrict) params.set('dist', $selectedDistrict);
    if ($selectedBoundaryMap) params.set('map', $selectedBoundaryMap);
    if ($selectedCoordinates) {
      params.set('lng', $selectedCoordinates.lng.toString());
      params.set('lat', $selectedCoordinates.lat.toString());
    }
    const newUrl = `${$page.url.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }
</script>

<main
  id="main"
  class="flex flex-col md:flex-row h-full absolute bottom-0 left-0 right-0 dark:bg-neutral-900"
>
  <Sidebar />
  <div class="relative flex-1 order-first md:order-last">
    <Map />
    <div
      class="md:absolute md:top-3 md:left-3 md:right-3 absolute bottom-0 left-0 right-0 p-3 pointer-events-none"
    >
      <div class="pointer-events-auto">
        <Controls />
      </div>
    </div>
  </div>
</main>

<style>
  /* Hide the controls based on screen size */
  @media (max-width: 768px) {
    :global(.maplibregl-ctrl-bottom-right) {
      display: none;
    }
  }
  @media (max-width: 768px) {
    :global(.maplibregl-ctrl-bottom-left) {
      display: none;
    }
  }
  @media (min-width: 768px) {
    :global(.maplibregl-ctrl-top-right) {
      display: none;
    }
  }
  @media (min-width: 768px) {
    :global(.maplibregl-ctrl-top-left) {
      display: none;
    }
  }
  :global(.maplibregl-ctrl-fullscreen .maplibregl-ctrl-icon) {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0YjU1NjMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1heGltaXplLTIiPjxwb2x5bGluZSBwb2ludHM9IjE1IDMgMjEgMyAyMSA5Ii8+PHBvbHlsaW5lIHBvaW50cz0iOSAyMSAzIDIxIDMgMTUiLz48bGluZSB4MT0iMjEiIHgyPSIxNCIgeTE9IjMiIHkyPSIxMCIvPjxsaW5lIHgxPSIzIiB4Mj0iMTAiIHkxPSIyMSIgeTI9IjE0Ii8+PC9zdmc+') !important;
  }
</style>
