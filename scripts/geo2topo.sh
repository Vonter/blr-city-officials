#!/bin/bash

# Combine GeoJSONs
jq '{"type": "FeatureCollection", "features": [.[] | .features[]]}' --slurp geojson/*.geojson > Combined.geojson

# Clip to bbox
ogr2ogr -explodecollections -makevalid -spat 77.22 12.67 77.84 13.33 Clipped.geojson Combined.geojson

# Snap geometries

# On MacOS use `/Applications/QGIS.app/Contents/MacOS/bin/qgis_process` instead of `qgis_process`
if [[ "$OSTYPE" == "darwin"* ]]; then
  qgis_process="/Applications/QGIS.app/Contents/MacOS/bin/qgis_process"
else
  qgis_process="qgis_process"
fi
$qgis_process run native:snapgeometries --distance_units=meters --area_units=m2 --ellipsoid=EPSG:7030 --INPUT='./Clipped.geojson' --REFERENCE_LAYER='./Clipped.geojson' --TOLERANCE=0.0003 --BEHAVIOR=0 --OUTPUT='./Snapped.geojson'

# Save as TopoJSON
geo2topo --out boundaries.json Snapped.geojson

# Rename object to boundaries
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' 's/"Snapped"/"boundaries"/' boundaries.json
else
  sed -i 's/"Snapped"/"boundaries"/' boundaries.json
fi
