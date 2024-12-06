#!/bin/bash

# Combine GeoJSONs
jq '{"type": "FeatureCollection", "features": [.[] | .features[]]}' --slurp geojson/*.geojson > Combined.geojson

# Clip to bbox
ogr2ogr -explodecollections -makevalid -spat 77.2 12.6 77.9 13.4 Clipped.geojson Combined.geojson

# Snap geometries
qgis_process run native:snapgeometries --distance_units=meters --area_units=m2 --ellipsoid=EPSG:7030 --INPUT='./Clipped.geojson' --REFERENCE_LAYER='./Clipped.geojson' --TOLERANCE=0.001 --BEHAVIOR=0 --OUTPUT='./Snapped.geojson'

# Save as TopoJSON
geo2topo --out boundaries.json Snapped.geojson

# Rename object to boundaries
sed -i 's/"Snapped"/"boundaries"/' boundaries.json
