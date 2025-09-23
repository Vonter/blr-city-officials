import type { RequestHandler } from './$types';
import { loadOfficials, getOfficialDetails } from '$lib/boundary-utils';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  const boundaryId = url.searchParams.get('boundaryId');
  const districtId = url.searchParams.get('districtId');

  if (!boundaryId || !districtId) {
    return json(
      { error: 'boundaryId and districtId parameters are required' },
      { status: 400 }
    );
  }

  try {
    const officials = await loadOfficials();
    const officialDetails = getOfficialDetails(
      boundaryId,
      districtId,
      officials
    );

    return json(
      {
        boundaryId,
        districtId,
        officials: officialDetails || [],
        hasOfficials: !!officialDetails
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
    console.error('Error in district-details API:', error);
    return json({ error: 'Failed to fetch district details' }, { status: 500 });
  }
};
