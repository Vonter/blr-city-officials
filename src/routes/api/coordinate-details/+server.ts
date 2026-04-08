import type { RequestHandler } from './$types';
import type { Feature } from 'geojson';
import { loadBoundaries, isValidCity } from '$lib/boundary-utils';
import { json } from '@sveltejs/kit';
// @ts-ignore - PolygonLookup doesn't have proper TypeScript definitions
import PolygonLookup from 'polygon-lookup';
import { getBaseUrl } from '../../../helpers/serverUtils';

const lookupCache = new Map<string, any>();

export const GET: RequestHandler = async ({ url, request }) => {
  const city = url.searchParams.get('city');
  const lng = parseFloat(url.searchParams.get('lng') || '0');
  const lat = parseFloat(url.searchParams.get('lat') || '0');

  if (!city || !lng || !lat) {
    return json(
      { error: 'city, lng, and lat parameters are required' },
      { status: 400 }
    );
  }

  if (!isValidCity(city)) {
    return json({ error: `Unknown city: ${city}` }, { status: 400 });
  }

  try {
    const baseUrl = getBaseUrl(request, url);
    const boundaries = await loadBoundaries(baseUrl, city);

    if (!lookupCache.has(city)) {
      lookupCache.set(city, new PolygonLookup(boundaries));
    }
    const searchResults = lookupCache.get(city).search(lng, lat, -1);
    const intersectingDistricts = searchResults.features;

    return json(
      {
        districts: intersectingDistricts.map((feature: Feature) => ({
          id: feature.properties?.['id'],
          namecol: feature.properties?.['namecol'],
          wardName: feature.properties?.['wardName'],
          wardNumber: feature.properties?.['wardNumber']
        }))
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'CDN-Cache-Control': 'max-age=3600',
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
