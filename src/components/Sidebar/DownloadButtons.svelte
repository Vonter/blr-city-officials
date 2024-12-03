<script lang="ts">
  import type { FeatureCollection } from 'geojson';
  import { toKML } from '@placemarkio/tokml';
  import { getDownloadableUrl } from '../../helpers/helpers';

  export let data: FeatureCollection;
  export let filename: string;

  $: geojsonDownloadUrl = getDownloadableUrl(data, true);
  $: kmlDownloadUrl = getDownloadableUrl(toKML(data), false);
</script>

<div class="flex flex-col">
  <a
    href={geojsonDownloadUrl}
    download="{filename}.geojson"
    class="flex items-center py-1 px-3 -ml-4 text-gray-400 dark:text-gray-400
            hover:text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
    target="_blank"
    title="GeoJSON"
    rel="noreferrer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-5 w-5 inline-block mr-1"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
    GeoJSON
  </a>
  <a
    href={kmlDownloadUrl}
    download="{filename}.kml"
    class="flex items-center py-1 px-3 -ml-4 text-gray-400 dark:text-gray-400
            hover:text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
    target="_blank"
    title="KML"
    rel="noreferrer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-5 w-5 inline-block mr-1"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
    KML
  </a>
</div> 