<script>
  /* Based on https://github.com/silinternational/svelte-google-places-autocomplete */

  import { createEventDispatcher, onMount } from 'svelte';

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
    inputField.value = '';
    onChange();
  }

  function hasLocationData(place) {
    const fieldsToLookFor = (options &&
      options.fields?.indexOf('ALL') === -1 &&
      options.fields) || ['geometry'];
    return place.hasOwnProperty(fieldsToLookFor[0]);
  }

  function onChange() {
    if (inputField.value === '') {
      setSelectedLocation(null);
    }
  }

  function onKeyDown(event) {
    const suggestionsAreVisible =
      document.getElementsByClassName('pac-item').length;

    if (event.key === 'Enter' || event.key === 'Tab') {
      if (suggestionsAreVisible) {
        const isSuggestionSelected =
          document.getElementsByClassName('pac-item-selected').length;
        if (!isSuggestionSelected) {
          selectFirstSuggestion();
        }
      } else if (doesNotMatchSelectedLocation(inputField.value)) {
        setTimeout(emptyLocationField, 10);
      }
    } else if (event.key === 'Escape') {
      setTimeout(emptyLocationField, 10);
    }

    if (suggestionsAreVisible) {
      if (event.key === 'Enter') {
        /* When suggestions are visible, don't let an 'Enter' submit a form (since
         * the user is interacting with the list of suggestions at the time, not
         * expecting their actions to affect the form as a whole). */
        event.preventDefault();
      }
    }
  }

  function selectFirstSuggestion() {
    // Simulate the 'down arrow' key in order to select the first suggestion:
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
    const simulatedEvent = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40
    });
    inputField.dispatchEvent(simulatedEvent);
  }

  function setSelectedLocation(data) {
    selectedLocationName = (data && data.text) || '';
    dispatch('place_changed', data);
  }

  function doesNotMatchSelectedLocation(value) {
    return selectedLocationName !== value;
  }

  let isLoadingLibrary = false;

  /**
   * The list of callbacks, one from each GooglePlacesAutocomplete instance that requested the library before the library
   * had finished loading.
   */
  const callbacks = [];

  function hasLoadedLibrary() {
    return window.google && window.google.maps && window.google.maps.places;
  }

  /**
   * Load the Google Places library and notify the calling code (if given a callback) once the library is ready.
   *
   * This supports three scenarios:
   * 1. The library hasn't been loaded yet and isn't in the process of loading yet.
   * 2. The library hasn't been loaded yet but is already in the process of loading.
   * 3. The library has already been loaded.
   *
   * In scenarios 1 and 2, any callbacks that have been provided (which could be multiple, if multiple
   * GooglePlacesAutocomplete instances are in use) will be called when the library finishes loading.
   *
   * In scenario 3, the callback will be called immediately.
   *
   * @param apiKey Your Google Places API Key
   * @param callback A callback (if you want to be notified when the library is available for use)
   */
  export function loadGooglePlacesLibrary(apiKey, callback) {
    if (hasLoadedLibrary()) {
      callback();
      return;
    }

    callback && callbacks.push(callback);

    if (isLoadingLibrary) {
      return;
    }

    isLoadingLibrary = true;

    const element = document.createElement('script');
    element.async = true;
    element.defer = true;
    element.onload = onLibraryLoaded;
    element.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places&callback=Function.prototype`;
    element.type = 'text/javascript';

    document.head.appendChild(element);
  }

  function onLibraryLoaded() {
    isLoadingLibrary = false;
    let callback;
    while ((callback = callbacks.pop())) {
      callback();
    }
  }
</script>

<input
  bind:this={inputField}
  class={$$props.class}
  on:change={onChange}
  on:keydown={onKeyDown}
  {placeholder}
  {value}
  {required}
  {pattern}
/>
