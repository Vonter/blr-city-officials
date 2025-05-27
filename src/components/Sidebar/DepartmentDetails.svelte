<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { layers } from '../../assets/boundaries';

  export let department: string;
  export let locale: string | null | undefined;

  $: config = layers[department] || {
    defaultOfficials: [],
    defaultContacts: []
  };

  $: isKannada = locale?.startsWith('kn');
</script>

{#if config.defaultContacts && config.defaultContacts.length > 0}
  <div
    class="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 break-words mb-4"
  >
    <div class="border-gray-200 dark:border-neutral-600">
      <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {isKannada ? 'ಸಂಪರ್ಕ ಮಾಹಿತಿ' : 'Contact Information'}
      </div>
      <div class="flex flex-wrap gap-2">
        {#each config.defaultContacts as contact}
          {#if contact.type === 'phone'}
            <a
              href="tel:{contact.value}"
              class="inline-flex items-center px-3 py-1 text-sm rounded bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-600 border border-gray-200 dark:border-neutral-600 transition-colors max-w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                />
              </svg>
              <span class="text-xs text-gray-500 dark:text-gray-400 mr-2">
                {isKannada ? contact.labelKn : contact.label}:
              </span>
              <span class="truncate">{contact.value}</span>
            </a>
          {:else if contact.type === 'email'}
            <a
              href="mailto:{contact.value}"
              class="inline-flex items-center px-3 py-1 text-sm rounded bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-600 border border-gray-200 dark:border-neutral-600 transition-colors max-w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                />
                <path
                  d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                />
              </svg>
              <span class="text-xs text-gray-500 dark:text-gray-400 mr-2">
                {isKannada ? contact.labelKn : contact.label}:
              </span>
              <span class="truncate">{contact.value}</span>
            </a>
          {:else if contact.type === 'whatsapp'}
            <a
              href="https://wa.me/{contact.value}"
              class="inline-flex items-center px-3 py-1 text-sm rounded bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-600 border border-gray-200 dark:border-neutral-600 transition-colors max-w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                />
              </svg>
              <span class="text-xs text-gray-500 dark:text-gray-400 mr-2">
                {isKannada ? contact.labelKn : contact.label}:
              </span>
              <span class="truncate">{contact.value}</span>
            </a>
          {/if}
        {/each}
      </div>
    </div>
  </div>
{/if}

{#if config.defaultOfficials && config.defaultOfficials.length > 0}
  <div
    class="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 break-words mb-4"
  >
    {#each config.defaultOfficials as official}
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {isKannada ? official.titleKn : official.titleEn}
      </div>
      <div class="text-ml font-medium text-gray-900 dark:text-gray-100 mb-4">
        {isKannada ? official.nameKn : official.nameEn}
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {isKannada ? official.messageKn : official.messageEn}
      </p>
    {/each}
  </div>
{/if}
