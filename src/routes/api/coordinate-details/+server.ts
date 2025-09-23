import type { RequestHandler } from './$types';
import type { Feature } from 'geojson';
import { loadBoundaries } from '$lib/boundary-utils';
import { json } from '@sveltejs/kit';
// @ts-ignore - PolygonLookup doesn't have proper TypeScript definitions
import PolygonLookup from 'polygon-lookup';

export const GET: RequestHandler = async ({ url, request }) => {
  const lng = parseFloat(url.searchParams.get('lng') || '0');
  const lat = parseFloat(url.searchParams.get('lat') || '0');

  if (!lng || !lat) {
    return json(
      { error: 'lng and lat parameters are required' },
      { status: 400 }
    );
  }

  try {
    const host = request.headers.get('host') || url.host;
    const baseUrl = `https://${host}`;
    const boundaries = await loadBoundaries(baseUrl);

    // Create lookup instance for this request
    const lookup = new PolygonLookup(boundaries);
    const searchResults = lookup.search(lng, lat, -1);
    const intersectingDistricts = searchResults.features;

    return json(
      {
        coordinates: { lng, lat },
        districts: intersectingDistricts.map((feature: Feature) => ({
          id: feature.properties?.['namecol'],
          name: feature.properties?.['namecol'],
          boundaryId: feature.properties?.['id'],
          properties: feature.properties,
          geometry: feature.geometry
        }))
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 24 hours
          'CDN-Cache-Control': 'max-age=3600', // Cloudflare-specific
          Vary: 'Accept-Encoding'
        }
      }
    );
  } catch (error) {
    console.error('Error in coordinate-details API:', error);
    return json(
      { error: 'Failed to fetch coordinate details' },
      { status: 500 }
    );
  }
};
