<script lang="ts">
  interface Props {
    title: string;
    onBack?: (() => void) | undefined;
    children?: import('svelte').Snippet;
  }

  let { title, onBack = undefined, children }: Props = $props();
</script>

<header
  class="p-4 sticky top-0 bg-white/90 dark:bg-neutral-900 z-20 border-b border-gray-900/10 shadow-sm"
>
  <div class="flex">
    {#if onBack}
      <button
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
    <h1 class="text-lg tracking-tight flex-1 mt-0.5">
      {title}
    </h1>
  </div>
  {@render children?.()}
</header>
