<script lang="ts">
  import type { FeatureCollection } from 'geojson';
  import { toKML } from '@placemarkio/tokml';
  import { getDownloadableUrl } from '../../helpers/helpers';

  export let data: FeatureCollection;
  export let filename: string;

  $: geojsonDownloadUrl = getDownloadableUrl(data, true);
  $: kmlDownloadUrl = getDownloadableUrl(toKML(data), false);
</script>

<div class="flex flex-col gap-2 p-2">
  <a
    href={geojsonDownloadUrl}
    download="{filename}.geojson"
    class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 border border-gray-200 dark:border-neutral-600 rounded-lg shadow-sm transition-colors duration-200"
    target="_blank"
    title="Download as GeoJSON"
    rel="noreferrer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-5 w-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
    Download GeoJSON
  </a>
  <a
    href={kmlDownloadUrl}
    download="{filename}.kml"
    class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 border border-gray-200 dark:border-neutral-600 rounded-lg shadow-sm transition-colors duration-200"
    target="_blank"
    title="Download as KML"
    rel="noreferrer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-5 w-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
    Download KML
  </a>
</div>
