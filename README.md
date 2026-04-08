# city-officials

An interactive tool to find local jurisdictions and officials in Indian cities: https://cityofficials.bengawalk.com

Based on and heavily inspired by the [NYC Boundaries Map](https://github.com/BetaNYC/nyc-boundaries) built by [BetaNYC](https://github.com/BetaNYC)

## Contribute

- Report an issue or request a feature on the [issues](https://github.com/Vonter/city-officials/issues) page
- Create a pull request for an issue or feature request on the [issues](https://github.com/Vonter/city-officials/issues) page

## Develop

- Install dependencies with `pnpm install` (or `npm install`)
- Start local dev server with `pnpm run dev` (or `npm run dev`)
- Build site deployment assets with `pnpm run build` (or `npm run build`)

## Architecture

The app is built with [SvelteKit](https://kit.svelte.dev/), using [MapLibre GL](https://maplibre.org/) for the map, and styled with Tailwind CSS. It supports multiple cities, the `VITE_CITY` environment variable selects a city at build time.

```
src/
├── assets/          # Locale files and boundary data per city
├── components/      # Map, Sidebar, Search, Controls, etc.
├── configs/         # Per-city config (departments, map defaults, SEO)
├── helpers/         # API client, spatial utils, colors, debounce
├── lib/             # Boundary and Maps utilities
├── routes/          # SvelteKit pages and API endpoints
├── stores.ts        # Svelte stores for boundaries, officials, UI state
├── types/           # TypeScript type declarations
└── service-worker.js
static/
├── {cityId}/        # Per-city officials.json and TopoJSON boundary files
└── icons/           # City logos
scripts/
├── geo2topo.sh      # GeoJSON → TopoJSON conversion
├── {cityId}/        # Per-city source data
│   └── geojson/     # Source GeoJSON boundary files
└── README.md
```

Processing scripts convert source GeoJSON into TopoJSON boundary files. At runtime, the app:
- Loads the city config
- Fetches boundaries on demand
- Converts TopoJSON to GeoJSON on the client-side

Localization uses `svelte-i18n` with shared and city-specific locale files, stored in `src/assets/locales`.

Service worker caches static assets, map tiles, and boundary data for offline use, implemented using Workbox.

Server-side APIs are implemented for functionality involving querying officials or TopoJSON boundary files, to reduce load on client-side processing.

City-specific scripts are available for building the city-specific site:

```
pnpm run dev:blr        # Dev server for Bengaluru
pnpm run build:mumbai   # Production build for Mumbai
```

The site is deployed to Cloudflare Pages via the `@sveltejs/adapter-cloudflare` SvelteKit Adapter.

### Data

The geospatial boundary data and details about officials are sourced from multiple government websites. The officials details are maintained in `officials.json` files under `static/{cityId}/`.

Processing scripts in [scripts/](scripts) convert raw data into app-ready formats:

- `geo2topo.sh <city>`: clips source GeoJSON to a city bounding box, simplifies geometry, and converts to TopoJSON

If you notice errors in the data, please submit feedback via the [Form](https://forms.gle/6rBZHs21szmXvxBx8).

## Copyright

Please see the [LICENSE](https://github.com/Vonter/city-officials/blob/main/LICENSE) file for details.

- Non-code, Creative Commons Attribution 4.0
- Code, GNU General Public License

For the original source on which `city-officials` is based, see the [NYC Boundaries Map](https://github.com/BetaNYC/nyc-boundaries) built by [BetaNYC](https://github.com/BetaNYC)

## Questions

File an [issue](https://github.com/Vonter/city-officials) with the details
