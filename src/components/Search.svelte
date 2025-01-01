<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { _ } from 'svelte-i18n';
  import GooglePlacesAutocomplete from '../components/GooglePlacesAutocomplete.svelte';
  import * as gmapsLoader from '@googlemaps/js-api-loader';
  const { Loader } = gmapsLoader;
  import type { LngLat } from 'maplibre-gl';

  import {
    selectedBoundaryMap,
    isMapReady,
    selectedDistrict,
    selectedCoordinates
  } from '../stores';

  let loader: any;

  onMount(() => {
    if (browser) {
      loader = new Loader({
        apiKey: import.meta.env.VITE_GMAPS_API_KEY,
        version: 'weekly',
        libraries: ['geocoding']
      });
    }
  });

  const options = {
    bounds: {
      south: 12.5,
      north: 13.5,
      west: 77,
      east: 78.25
    },
    fields: ['place_id'],
    strictBounds: true
  };

  let isGettingLocation = $state(false);
  let inputField = $state<HTMLInputElement>();

  async function onPlaceChanged(e: CustomEvent) {
    if (!browser || !e || !$isMapReady || !loader) return;

    try {
      await loader.load();
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { placeId: e.detail.place.place_id },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            const { lat, lng } = results[0].geometry.location;
            selectedCoordinates.set({
              lat: lat().toFixed(5),
              lng: lng().toFixed(5)
            } as LngLat);
            selectedBoundaryMap.set(null);
            selectedDistrict.set(null);
          } else {
            console.error('Failed to geocode location: ', status);
          }
        }
      );
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  }

  async function useCurrentLocation() {
    if (!browser) return;

    isGettingLocation = true;
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const lngLat = {
        lng: position.coords.longitude,
        lat: position.coords.latitude
      };

      selectedCoordinates.set(lngLat as LngLat);
    } catch (error) {
      console.error('Error getting location:', error);
      alert(
        'Unable to get current location. Please try again or select a location on the map instead.'
      );
    } finally {
      isGettingLocation = false;
    }
  }
</script>

<div class="relative flex w-full justify-end gap-4">
  <button
    onclick={useCurrentLocation}
    class={`group w-10 h-10 flex items-center justify-center bg-white text-gray-600 hover:text-blue-600 shadow-md rounded hover:text-focus:outline-none focus:ring focus:ring-blue-500`}
    aria-label="Use GPS location"
  >
    <div
      class="invisible group-hover:visible absolute top-full right-0 mt-2 bg-black text-gray-100 rounded shadow-md px-2 py-0.5 dark:bg-white dark:text-gray-900"
    >
      Use GPS location
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4b5563"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={isGettingLocation ? 'animate-spin' : ''}
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  </button>
  <div class="relative flex flex-1">
    <GooglePlacesAutocomplete
      bind:inputField
      apiKey={import.meta.env.VITE_GMAPS_API_KEY}
      class="search relative flex-1 l-0 t-0 r-0 py-2 px-3 pl-10 pr-10 flex-1 w-full bg-white shadow-md rounded focus:outline-none focus:ring focus:ring-blue-500"
      on:place_changed={onPlaceChanged}
      placeholder={$_('search_placeholder')}
      {options}
      required
      pattern="[a-zA-Z ]+"
    ></GooglePlacesAutocomplete>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 absolute left-2.5 top-2.5"
      viewBox="0 0 20 20"
      fill="#4b5563"
    >
      <path
        fill-rule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clip-rule="evenodd"
      />
    </svg>
    <svg
      onclick={() => {
        if (inputField) {
          inputField.value = '';
        }
      }}
      onkeydown={e => {
        if (e.key === 'Enter' && inputField) {
          inputField.value = '';
        }
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4b5563"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-x absolute right-2.5 top-2.5 cursor-pointer"
      role="button"
      tabindex="-1"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
    >
  </div>
</div>
