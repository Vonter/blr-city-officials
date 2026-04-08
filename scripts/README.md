# scripts

City-specific data processing scripts.

```
scripts/
  geo2topo.sh        # Unified GeoJSON → TopoJSON conversion
  <city>/
    geojson/         # Source boundary GeoJSON files
    ...              # City-specific scripts
```

## geo2topo.sh

`geo2topo.sh` takes input boundary GeoJSONs from `<city>/geojson/`, clips (when a bounding box is configured), snaps, simplifies, and saves them as TopoJSON files in `static/<city>/`.

Run from anywhere:
```bash
./scripts/geo2topo.sh blr
./scripts/geo2topo.sh mumbai
```

Per-city configuration (bounding box) is defined inside the script. All cities use the same snap interval and simplification settings.

### Adding a new city

1. Create `scripts/<city>/geojson/` and add boundary GeoJSON files
2. Add a `case` entry in `geo2topo.sh` with the city's bounding box (or `""` if no clipping is needed)
3. Run `./scripts/geo2topo.sh <city>`

### Adding new boundaries

Features in the boundary GeoJSON need two fields:
- `namecol`: Name of the feature (title case)
- `id`: Category of the boundary

Remove any extra fields to reduce file size. After adding a compatible GeoJSON, run `./scripts/geo2topo.sh <city>` and update `src/assets/boundaries/index.ts` if the `id` is new.
