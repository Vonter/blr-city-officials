import type { RequestHandler } from './$types';
import {
  loadBoundaries,
  sortedDistricts,
  isValidCity
} from '$lib/boundary-utils';
import { json } from '@sveltejs/kit';
import { getBaseUrl } from '../../../helpers/serverUtils';

export const GET: RequestHandler = async ({ url, request }) => {
  const city = url.searchParams.get('city');
  const boundaryId = url.searchParams.get('boundaryId');

  if (!city || !boundaryId) {
    return json(
      { error: 'city and boundaryId parameters are required' },
      { status: 400 }
    );
  }

  if (!isValidCity(city)) {
    return json({ error: `Unknown city: ${city}` }, { status: 400 });
  }

  try {
    const baseUrl = getBaseUrl(request, url);
    const boundaries = await loadBoundaries(baseUrl, city);

    const filteredFeatures = boundaries.features.filter(
      (boundary: any) => boundary.properties?.['id'] === boundaryId
    );

    const districts = sortedDistricts(filteredFeatures);

    return json(
      {
        districts: districts.map((d: any) => ({
          namecol: d.properties?.['namecol'],
          wardName: d.properties?.['wardName'],
          wardNumber: d.properties?.['wardNumber']
        }))
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'CDN-Cache-Control': 'max-age=86400',
          Vary: 'Accept-Encoding'
        }
      }
    );
  } catch (error) {
    console.error('Error in boundary-details API:', error);
    return json({ error: 'Failed to fetch boundary details' }, { status: 500 });
  }
};
