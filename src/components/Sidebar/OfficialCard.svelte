<script lang="ts">
  import Icon from '../Icon.svelte';
  import { isRegionalLocale } from '../../helpers/helpers';
  import { CONTACT_LINK_CLASS } from '../../helpers/contactHelpers';

  interface Props {
    official: any;
    locale: string | null | undefined;
  }

  let { official, locale }: Props = $props();

  const isRegional = $derived(isRegionalLocale(locale));
  const phones = $derived(
    official.Phone && typeof official.Phone === 'string'
      ? official.Phone.split(',').map((p: string) => p.trim())
      : []
  );
</script>

<div
  class="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 break-words"
>
  {#if official.Designation && official.Designation !== '-'}
    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
      {isRegional ? official.DesignationRegional : official.Designation}
    </div>
  {/if}

  {#if official.Name && official.Name !== '-'}
    <div class="text-ml font-medium text-gray-900 dark:text-gray-100 mb-3">
      {isRegional ? official.NameRegional : official.Name}
    </div>
  {/if}

  <div class="flex flex-wrap gap-2">
    {#each phones as phone}
      <a href="tel:{phone}" class={CONTACT_LINK_CLASS}>
        <Icon name="phone" class="h-4 w-4 mr-2 flex-shrink-0" />
        <span class="truncate">{phone}</span>
      </a>
    {/each}
    {#if official['E-Mail']}
      <a href="mailto:{official['E-Mail']}" class={CONTACT_LINK_CLASS}>
        <Icon name="email" class="h-4 w-4 mr-2 flex-shrink-0" />
        <span class="truncate">{official['E-Mail']}</span>
      </a>
    {/if}
    {#if official.WhatsApp}
      <a
        href="https://wa.me/{official.WhatsApp}"
        target="_blank"
        rel="noopener noreferrer"
        class={CONTACT_LINK_CLASS}
      >
        <Icon name="whatsapp" class="h-4 w-4 mr-2 flex-shrink-0" />
        <span class="truncate">{official.WhatsApp}</span>
      </a>
    {/if}
    {#if official.Twitter}
      <a
        href={official.Twitter}
        target="_blank"
        rel="noopener noreferrer"
        class={CONTACT_LINK_CLASS}
      >
        <Icon name="twitter" class="h-4 w-4 mr-2 flex-shrink-0" />
        <span class="truncate">X</span>
      </a>
    {/if}
  </div>
</div>
