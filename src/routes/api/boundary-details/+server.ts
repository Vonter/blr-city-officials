import type { RequestHandler } from './$types';
import { loadBoundaries, sortedDistricts } from '$lib/boundary-utils';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, request }) => {
  const boundaryId = url.searchParams.get('boundaryId');

  if (!boundaryId) {
    return json({ error: 'boundaryId parameter is required' }, { status: 400 });
  }

  try {
    const host = request.headers.get('host') || url.host;
    let baseUrl = `https://${host}`;
    if (process.env['NODE_ENV'] === 'development') {
      baseUrl = `http://${host}`;
    }
    const boundaries = await loadBoundaries(baseUrl);

    const filteredFeatures = boundaries.features.filter(
      (boundary: any) => boundary.properties?.['id'] === boundaryId
    );

    const districts = sortedDistricts(filteredFeatures);

    return json(
      {
        districts: districts.map((d: any) => ({
          id: d.properties?.['namecol'],
          name: d.properties?.['namecol'],
          properties: d.properties
        }))
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24 hours
          'CDN-Cache-Control': 'max-age=86400', // Cloudflare-specific
          Vary: 'Accept-Encoding'
        }
      }
    );
  } catch (error) {
    console.error('Error in boundary-details API:', error);
    return json({ error: 'Failed to fetch boundary details' }, { status: 500 });
  }
};
