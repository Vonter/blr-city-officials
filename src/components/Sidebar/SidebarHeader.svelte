<script lang="ts">
  interface Props {
    title: string;
    logoUrl?: string | undefined;
    onBack?: (() => void) | undefined;
    onTitleClick?: (() => void) | undefined;
    children?: import('svelte').Snippet;
  }

  let {
    title,
    logoUrl = undefined,
    onBack = undefined,
    onTitleClick = undefined,
    children
  }: Props = $props();
</script>

<header
  class="h-[60px] p-4 sticky top-0 bg-white/90 dark:bg-neutral-900 z-20 border-b border-gray-900/10 dark:border-gray-100/10 shadow-sm"
>
  <div class="flex items-center h-full">
    {#if onBack}
      <button
        aria-label="Go back"
        onclick={onBack}
        class="w-8 h-8 mr-2 -ml-1 text-lg flex justify-center items-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/20 dark:hover:text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    {/if}
    {#if onTitleClick}
      <button
        onclick={onTitleClick}
        title="Change city"
        class="text-lg tracking-tight flex-1 text-left transition-all flex items-center gap-2 cursor-pointer group"
      >
        {#if logoUrl}
          <img src={logoUrl} alt="" class="h-7 w-7 object-contain" />
        {/if}
        <span
          class="underline decoration-gray-300 dark:decoration-gray-600 underline-offset-4 group-hover:decoration-gray-600 dark:group-hover:decoration-gray-400 transition-colors"
        >
          {title}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    {:else}
      <h1 class="text-lg tracking-tight flex-1 flex items-center gap-2">
        {#if logoUrl}
          <img src={logoUrl} alt="" class="h-7 w-7 object-contain" />
        {/if}
        {title}
      </h1>
    {/if}
    {@render children?.()}
  </div>
</header>
