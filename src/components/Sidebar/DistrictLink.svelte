<script lang="ts">
  interface Props {
    onMouseOver: () => void;
    onMouseOut: () => void;
    onClick: () => void;
    nameCol: string;
    nameLong: string;
    icon: string;
  }

  let { onMouseOver, onMouseOut, onClick, nameCol, nameLong, icon }: Props =
    $props();
</script>

<div
  role="group"
  class="flex flex-col hover:bg-gray-200 focus-within:bg-gray-100 dark:hover:bg-white/20 dark:focus-within:bg-white/20 focus:z-10"
  onmouseover={onMouseOver}
  onfocus={onMouseOver}
  onmouseleave={onMouseOut}
  onblur={onMouseOut}
>
  <button
    onclick={onClick}
    aria-label={`View details for ${nameCol}`}
    class="flex-1 text-left focus:outline-none focus:ring focus:ring-blue-500 focus:z-10 px-4 py-1"
  >
    <div class="flex flex-col w-full">
      <div class="block text-sm text-gray-600 dark:text-gray-400">
        {nameLong}
      </div>
      <div class="flex items-center">
        <div class="mr-2">{icon}</div>
        <div>{nameCol}</div>
      </div>
    </div>
  </button>
</div>
