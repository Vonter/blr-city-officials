<script>
  /* Based on https://github.com/silinternational/svelte-google-places-autocomplete */

  import { onMount } from 'svelte';
  import { getLoader } from '../lib/gmaps';

  let {
    apiKey,
    options = undefined,
    placeholder = undefined,
    value = '',
    required = false,
    pattern = undefined,
    inputField = $bindable(),
    class: className = '',
    onready = () => {},
    onplace_changed = _data => {}
  } = $props();

  let selectedLocationName = $state(value || '');
  let autocompleteInstance = null;

  onMount(() => {
    loadGooglePlacesLibrary(apiKey, () => {
      autocompleteInstance = new google.maps.places.Autocomplete(
        inputField,
        options
      );

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();

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

      onready();
    });
  });

  $effect(() => {
    if (autocompleteInstance && options?.bounds) {
      autocompleteInstance.setBounds(options.bounds);
    }
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
    onplace_changed(data);
  }

  function doesNotMatchSelectedLocation(value) {
    return selectedLocationName !== value;
  }

  export function loadGooglePlacesLibrary(apiKey, callback) {
    getLoader(apiKey)
      .importLibrary('places')
      .then(callback)
      .catch(console.error);
  }
</script>

<input
  bind:this={inputField}
  class={className}
  onchange={onChange}
  onkeydown={onKeyDown}
  {placeholder}
  {value}
  {required}
  {pattern}
/>
