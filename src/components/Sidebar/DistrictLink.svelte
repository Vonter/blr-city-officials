<script lang="ts">
  interface Props {
    onMouseOver: () => void;
    onMouseOut: () => void;
    onClick: () => void;
    formatContent: Function;
    formatUrl?: Function | undefined;
    nameCol: string;
    area: number;
    searea: number;
    icon: string;
  }

  let {
    onMouseOver,
    onMouseOut,
    onClick,
    formatContent,
    formatUrl = undefined,
    nameCol,
    icon
  }: Props = $props();
</script>

<div
  role="group"
  class="flex items-stretch hover:bg-gray-100 focus-within:bg-gray-100 dark:hover:bg-white/20 dark:focus-within:bg-white/20 focus:z-10"
  onmouseover={onMouseOver}
  onfocus={onMouseOver}
  onmouseleave={onMouseOut}
  onblur={onMouseOut}
>
  <button
    onclick={onClick}
    aria-label={`View details for ${formatContent(nameCol)}`}
    class="flex-1 flex text-left py-1 px-4 focus:outline-none focus:ring focus:ring-blue-500 focus:z-10"
  >
    <div class="mr-2">{icon}</div>
    <div class="flex flex-row justify-between w-full">
      <div class="flex flex-row">
        {formatContent(nameCol)}
      </div>
    </div>
  </button>
  {#if formatUrl}
    <a
      href={formatUrl(nameCol)}
      aria-label={`Visit official webpage for ${formatContent(nameCol)}`}
      class="flex items-center py-1 px-3 -ml-4 text-gray-400 dark:text-gray-600
              hover:text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
      target="_blank"
      title="Visit official webpage"
      rel="noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
        />
        <path
          d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
        />
      </svg>
    </a>
  {/if}
</div>
