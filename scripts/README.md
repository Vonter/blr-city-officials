# scripts

The following scripts are used for the data on the site:
- [geo2topo.sh](geo2topo.sh)

## geo2topo.sh

The `geo2topo.sh` script takes the input boundary GeoJSONs under [geojson/](geojson), combines, clips, snaps, and saves them into a `boundaries.json` TopoJSON.

### Adding new boundaries

In order to add a new boundary, the features in the boundary GeoJSON need to contain 2 fields to be compatible with the site:
- `namecol`: Name of the feature
- `id`: Category of the boundary

If additional fields are there in the GeoJSON, it is recommended to remove them for reducing the file size. The `namecol` field should contain the feature names in title case for better readability.

After adding a compatible boundary GeoJSON:
- Run the `geo2topo.sh` script to generate the `boundaries.json` TopoJSON file
- Update `public/boundaries.json` with the new `boundaries.json`
- Update `src/assets/boundaries/index.ts` with details about the new boundary, in case the `id` is not already listed in the file
