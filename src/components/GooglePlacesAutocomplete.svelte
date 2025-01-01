<script>
  /* Based on https://github.com/silinternational/svelte-google-places-autocomplete */

  import { createEventDispatcher, onMount } from 'svelte';
  import { browser } from '$app/environment';

  export let apiKey;
  export let options = undefined;
  export let placeholder = undefined;
  export let value = '';
  export let required = false;
  export let pattern = undefined;
  export let inputField = null;

  const dispatch = createEventDispatcher();

  $: selectedLocationName = value || '';

  onMount(() => {
    if (!browser) return;
    
    loadGooglePlacesLibrary(apiKey, () => {
      const autocomplete = new google.maps.places.Autocomplete(
        inputField,
        options
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        // There are circumstances where the place_changed event fires, but we
        // were NOT given location data. I only want to propagate the event if we
        // truly received location data from Google.
        // See the `Type something, no suggestions, hit Enter` test case.
        if (hasLocationData(place)) {
          setSelectedLocation({
            place: place,
            text: inputField.value
          });
        }
      });

      dispatch('ready');
    });
  });

  function emptyLocationField() {
    if (!browser) return;
    inputField.value = '';
    onChange();
  }

  function hasLocationData(place) {
    const fieldsToLookFor = (options &&
      options.fields?.indexOf('ALL') === -1 &&
      options.fields) || [
      'address_components',
      'formatted_address',
      'geometry',
      'icon',
      'name',
      'place_id',
      'plus_code',
      'types'
    ];

    return fieldsToLookFor.some(field => {
      if (field === 'geometry') {
        return place?.geometry?.location?.lat && place?.geometry?.location?.lng;
      }
      return place?.[field];
    });
  }

  function onChange() {
    dispatch('change', {
      text: inputField?.value || ''
    });
  }

  function setSelectedLocation(data) {
    selectedLocationName = data.text;
    dispatch('place_changed', data);
  }

  function hasLoadedLibrary() {
    return browser && typeof google !== 'undefined' && typeof google.maps !== 'undefined';
  }

  function loadGooglePlacesLibrary(apiKey, callback) {
    if (hasLoadedLibrary()) {
      callback();
      return;
    }

    if (!browser) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.addEventListener('load', () => {
      callback();
    });
    document.head.appendChild(script);
  }
</script>

<input
  bind:this={inputField}
  class={$$props.class}
  {placeholder}
  {required}
  {pattern}
  on:input={onChange}
  on:change={onChange}
  value={selectedLocationName}
/>
