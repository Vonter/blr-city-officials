<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { layers } from '../../assets/boundaries';
  import { isRegionalLocale } from '../../helpers/helpers';
  import type { Contact, OfficeLocation } from '../../configs/types';
  import Icon from '../Icon.svelte';
  import {
    CONTACT_LINK_CLASS,
    getContactHref,
    getContactIconName,
    isExternalContact,
    getContactDisplay
  } from '../../helpers/contactHelpers';

  interface Props {
    department: string;
    locale: string | null | undefined;
    shownContactValues?: Set<string>;
    officeLocation?: OfficeLocation | null;
    extraContacts?: Contact[];
  }

  let {
    department,
    locale,
    shownContactValues = new Set(),
    officeLocation = null,
    extraContacts = []
  }: Props = $props();

  const config = $derived(
    layers[department] || {
      defaultOfficials: [],
      defaultContacts: []
    }
  );

  const filteredContacts = $derived([
    ...(config.defaultContacts?.filter(
      (c: any) => !shownContactValues.has(c.value)
    ) || []),
    ...extraContacts
  ]);

  const isRegional = $derived(isRegionalLocale(locale));
</script>

{#if filteredContacts.length > 0}
  <div
    class="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 break-words mb-4"
  >
    <div class="border-gray-200 dark:border-neutral-600">
      <div class="flex flex-wrap gap-2">
        {#each filteredContacts as contact}
          <a
            href={getContactHref(contact)}
            target={isExternalContact(contact.type) ? '_blank' : undefined}
            rel={isExternalContact(contact.type)
              ? 'noopener noreferrer'
              : undefined}
            class={CONTACT_LINK_CLASS}
          >
            <Icon
              name={getContactIconName(contact.type)}
              class="h-4 w-4 mr-2 flex-shrink-0"
            />
            <span class="text-xs text-gray-500 dark:text-gray-400 mr-2">
              {$_(contact.labelKey)}:
            </span>
            <span class="truncate">{getContactDisplay(contact)}</span>
          </a>
        {/each}
      </div>
    </div>
  </div>
{/if}

{#if officeLocation}
  <div
    class="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 break-words mb-4"
  >
    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
      {$_(officeLocation?.labelKey || 'office_location')}
    </div>
    <a
      href="https://www.google.com/maps?q={officeLocation.lat},{officeLocation.lng}"
      target="_blank"
      rel="noopener noreferrer"
      class={CONTACT_LINK_CLASS}
    >
      <Icon name="location" class="h-4 w-4 mr-2 flex-shrink-0" />
      <span class="truncate">{officeLocation.name}</span>
    </a>
  </div>
{/if}

{#if config.defaultOfficials && config.defaultOfficials.length > 0}
  <div
    class="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 break-words mb-4"
  >
    {#each config.defaultOfficials as official}
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {isRegional ? official.titleRegional : official.titleEn}
      </div>
      <div class="text-ml font-medium text-gray-900 dark:text-gray-100 mb-4">
        {isRegional ? official.nameRegional : official.nameEn}
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {isRegional ? official.messageRegional : official.messageEn}
      </p>
    {/each}
  </div>
{/if}
