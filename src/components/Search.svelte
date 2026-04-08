<script lang="ts">
  import { browser } from '$app/environment';
  import { _ } from 'svelte-i18n';
  import GooglePlacesAutocomplete from '../components/GooglePlacesAutocomplete.svelte';
  import { getLoader } from '../lib/gmaps';
  import type { LngLat } from 'maplibre-gl';
  import Icon from './Icon.svelte';

  import {
    selectedBoundaryMap,
    isMapReady,
    selectedDistrict,
    selectedCoordinates
  } from '../stores';
  import { cityConfig, onCityChange } from '../configs/config';

  function boundsFromConfig(config: typeof cityConfig) {
    const mb = config.map.maxBounds;
    if (!mb) return undefined;
    return {
      south: mb[0][1],
      north: mb[1][1],
      west: mb[0][0],
      east: mb[1][0]
    };
  }

  let bounds = $state(boundsFromConfig(cityConfig));

  onCityChange(() => {
    bounds = boundsFromConfig(cityConfig);
  });

  let options = $derived({
    bounds,
    fields: ['place_id'] as string[],
    strictBounds: !!bounds,
    componentRestrictions: { country: 'in' }
  });

  let isGettingLocation = $state(false);
  let inputField = $state<HTMLInputElement>();

  async function onPlaceChanged(data: any) {
    if (!browser || !data || !$isMapReady) return;

    try {
      await getLoader(import.meta.env.VITE_GMAPS_API_KEY).importLibrary(
        'geocoding'
      );
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ placeId: data.place.place_id }, (results, status) => {
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
      });
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
    <Icon
      name="gps"
      class={`h-5 w-5 ${isGettingLocation ? 'animate-spin' : ''}`}
    />
  </button>
  <div class="relative flex flex-1">
    <GooglePlacesAutocomplete
      bind:inputField
      apiKey={import.meta.env.VITE_GMAPS_API_KEY}
      class="search relative flex-1 l-0 t-0 r-0 py-2 px-3 pl-10 pr-10 flex-1 w-full bg-white shadow-md rounded focus:outline-none focus:ring focus:ring-blue-500"
      onplace_changed={onPlaceChanged}
      placeholder={$_('search_placeholder')}
      {options}
      required
      pattern="[a-zA-Z ]+"
    ></GooglePlacesAutocomplete>
    <Icon
      name="search"
      class="h-5 w-5 absolute left-2.5 top-2.5 text-gray-600"
    />
    <button
      onclick={() => {
        if (inputField) inputField.value = '';
      }}
      class="absolute right-2.5 top-2.5 text-gray-600 cursor-pointer"
      aria-label="Clear search"
      tabindex="-1"
    >
      <Icon name="close" class="h-5 w-5" />
    </button>
  </div>
</div>
