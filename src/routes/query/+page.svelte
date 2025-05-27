<script lang="ts">
  import { onMount } from 'svelte';
  import type { Feature, FeatureCollection } from 'geojson';
  import { feature } from 'topojson-client';
  import PolygonLookup from 'polygon-lookup';
  import { layers } from '../../assets/boundaries';
  import officials from '../../officials.json'; // Import officials directly

  let districtsIntersectingAddress: Feature[] = $state([]);
  let isLoading = $state(false);
  let lookup: PolygonLookup | null = null;
  let boundaries: FeatureCollection;

  function queryAllDistrictsForCoordinates(coord: {
    lat: number;
    lon: number;
  }) {
    districtsIntersectingAddress = [];
    isLoading = true;
    if (!lookup && boundaries) {
      lookup = new PolygonLookup(boundaries);
    }
    if (!lookup) return [];

    const results = lookup.search(coord.lon, coord.lat, -1);
    isLoading = false;
    return results.features || [];
  }

  let coordinates = '';
  let results: Array<{
    coordinates: { lat: number; lon: number };
    containingBoundaries: Feature[];
  }> = $state([]);
  let loading = $state(false);

  onMount(async () => {
    try {
      const response = await fetch('./boundaries.json');
      const topojson = await response.json();
      const geojson = feature(topojson, topojson.objects.boundaries);
      boundaries = geojson as unknown as FeatureCollection;
    } catch (error) {
      console.error('Error fetching boundaries:', error);
      boundaries = {} as FeatureCollection;
    }
  });

  async function handleSubmit() {
    loading = true;
    results = [];

    // Split the input into lines and parse coordinates
    const pairs = coordinates
      .trim()
      .split('\n')
      .map(line => {
        const parts = line.split(',');
        if (parts.length !== 2) return null;
        const lat = parts[0]?.trim();
        const lon = parts[1]?.trim();
        if (!lat || !lon) return null;
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      })
      .filter(
        (coord): coord is { lat: number; lon: number } =>
          coord !== null && !isNaN(coord.lat) && !isNaN(coord.lon)
      );

    // Query boundaries for each coordinate pair
    for (const coord of pairs) {
      const containingBoundaries = queryAllDistrictsForCoordinates(coord);
      results = [...results, { coordinates: coord, containingBoundaries }];
    }

    loading = false;
  }

  // Update the TableRow type
  type TableRow = {
    coordinates: string;
    link: string;
    [key: string]: string | OfficialDetails; // Allow for official details
  };

  interface OfficialDetails {
    name: string;
    designation: string;
    email: string;
    phone: string;
  }

  function formatResults(
    results: Array<{
      coordinates: { lat: number; lon: number };
      containingBoundaries: Feature[];
    }>
  ): TableRow[] {
    return results.map(result => {
      const row: TableRow = {
        coordinates: `${result.coordinates.lat}, ${result.coordinates.lon}`,
        link: `https://cityofficials.bengawalk.com/?lng=${result.coordinates.lon}&lat=${result.coordinates.lat}`
      };

      // Initialize all boundary columns with empty official details
      Object.values(layers).forEach(def => {
        row[def.name_long] = '';
        row[`${def.name_long}_official`] = {
          name: '',
          designation: '',
          email: '',
          phone: ''
        };
      });

      // Fill in found boundaries and their officials
      result.containingBoundaries.forEach(boundary => {
        const id = boundary.properties?.['id'];
        const boundaryDef = layers[id as keyof typeof layers];
        if (boundaryDef) {
          const boundaryName = boundary.properties?.['namecol'] || '-';
          row[boundaryDef.name_long] = boundaryName;

          // Find and add official details
          const official = officials.find(
            o => o.Area === boundaryName && o.Department === id
          );
          if (official) {
            row[`${boundaryDef.name_long}_official`] = {
              name: official.Name,
              designation: official.Designation,
              email: official['E-Mail'],
              phone: official.Phone
            };
          }
        }
      });

      return row;
    });
  }

  async function copyCSV(results: TableRow[]) {
    if (results.length === 0) return;

    // Define headers - one for each boundary type
    const headers = [
      ...Object.values(layers).map(layer => layer.name_long),
      'Map Link'
    ];

    // Create CSV content
    const csvContent = [
      // Wrap headers in quotes
      headers.map(header => `"${header}"`).join(','),
      ...results.map(row => {
        const values = headers.map(header => {
          // Handle map link
          if (header === 'Map Link') {
            return row.link || '';
          }

          // Handle boundary and official information
          const boundaryName = row[header]?.toString() || '';
          const official = row[`${header}_official`] as OfficialDetails;

          if (!boundaryName) return '';

          // Combine boundary and official details in one cell, using | as separator
          let cellContent = boundaryName;
          if (official?.name) {
            if (official.name) cellContent += `: ${official.name}`;
            if (official.designation)
              cellContent += ` (${official.designation}) - `;
            if (official.email) cellContent += `${official.email}/`;
            if (official.phone) cellContent += `${official.phone}`;
          }

          // Replace commas with semicolons
          return cellContent.replace(/,/g, '\/');
        });

        // Clean and escape values
        return values
          .map(value => {
            const cleanValue = String(value).trim().replace(/\n/g, ' '); // Replace any actual newlines with spaces
            // Escape any double quotes by doubling them and always wrap in quotes
            return `"${cleanValue.replace(/"/g, '""')}"`;
          })
          .join(',');
      })
    ].join('\n');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(csvContent);
        alert('Results copied to clipboard!');
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = csvContent;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          textArea.remove();
          alert('Results copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy text: ', err);
          alert('Failed to copy to clipboard');
        }
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy to clipboard');
    }
  }
</script>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="container mx-auto px-4">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 text-center">
        BLR City Officials Query Tool
      </h1>
      <p class="mt-2 text-center text-gray-600 max-w-2xl mx-auto">
        Enter multiple coordinates and find their corresponding city officials
      </p>
    </header>

    <div class="grid grid-cols-1 gap-8">
      <!-- Input Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6">
          <form
            onsubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div class="space-y-4">
              <div>
                <label
                  for="coordinates"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Coordinates Input
                  <span class="text-sm font-normal text-gray-500 ml-2">
                    (one pair per line, comma-separated)
                  </span>
                </label>
                <textarea
                  id="coordinates"
                  bind:value={coordinates}
                  placeholder="12.9882,77.6222
12.966187,77.588590"
                  rows="12"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         font-mono text-sm resize-y bg-gray-50"
                ></textarea>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                  {#if loading}
                    <div class="flex items-center">
                      <svg
                        class="animate-spin h-4 w-4 mr-2 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  {/if}
                </div>
                <button
                  type="submit"
                  class="inline-flex items-center px-6 py-3 border border-transparent
                         text-base font-medium rounded-md shadow-sm text-white
                         bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-blue-500 transition-colors
                         duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Query Boundaries'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Results Section -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Results</h2>
            {#if results.length > 0}
              <button
                onclick={() => copyCSV(formatResults(results))}
                class="inline-flex items-center px-3 py-2 border border-gray-300
                       shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700
                       bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-blue-500"
              >
                Copy to Clipboard
                <svg
                  class="ml-2 -mr-0.5 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            {/if}
          </div>
          {#if results.length > 0}
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0"
                    >
                      Coordinates
                    </th>
                    {#each Object.values(layers) as boundary}
                      <th
                        class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0"
                      >
                        {boundary.name_long}
                      </th>
                    {/each}
                    <th
                      class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0"
                    >
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {#each formatResults(results) as row}
                    <tr class="hover:bg-gray-50 transition-colors duration-150">
                      <td class="px-4 py-3 text-sm font-mono text-gray-900">
                        {row.coordinates}
                      </td>
                      {#each Object.values(layers) as boundary}
                        <td class="px-4 py-3 text-sm text-gray-700">
                          <div class="space-y-2">
                            <div class="font-medium">
                              {row[boundary.name_long] || '—'}
                            </div>
                            {#if typeof row[`${boundary.name_long}_official`] === 'object' && row[`${boundary.name_long}_official`]?.name}
                              <div
                                class="pl-2 border-l-2 border-gray-200 space-y-1"
                              >
                                <div class="font-medium text-gray-900">
                                  {(
                                    row[
                                      `${boundary.name_long}_official`
                                    ] as OfficialDetails
                                  ).name}
                                </div>
                                <div class="text-gray-500">
                                  {(
                                    row[
                                      `${boundary.name_long}_official`
                                    ] as OfficialDetails
                                  ).designation}
                                </div>
                                <div>
                                  <a
                                    href="mailto:{(
                                      row[
                                        `${boundary.name_long}_official`
                                      ] as OfficialDetails
                                    ).email}"
                                    class="text-blue-600 hover:underline"
                                  >
                                    {(
                                      row[
                                        `${boundary.name_long}_official`
                                      ] as OfficialDetails
                                    ).email}
                                  </a>
                                </div>
                                <div class="text-gray-600">
                                  {(
                                    row[
                                      `${boundary.name_long}_official`
                                    ] as OfficialDetails
                                  ).phone}
                                </div>
                              </div>
                            {/if}
                          </div>
                        </td>
                      {/each}
                      <td class="px-4 py-3 text-sm text-gray-700">
                        <a
                          href={row.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View on Map
                        </a>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {:else}
            <div class="text-center py-12 text-gray-500">
              No results yet. Enter coordinates and submit to see the boundary
              information.
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom scrollbar styles for modern browsers */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
</style>
