import type { RequestHandler } from './$types';
import {
  loadOfficials,
  getOfficialDetails,
  isValidCity
} from '$lib/boundary-utils';
import { json } from '@sveltejs/kit';
import { getBaseUrl } from '../../../helpers/serverUtils';

export const GET: RequestHandler = async ({ url, request }) => {
  const city = url.searchParams.get('city');
  const boundaryId = url.searchParams.get('boundaryId');
  const districtId = url.searchParams.get('districtId');

  if (!city || !boundaryId || !districtId) {
    return json(
      {
        error: 'city, boundaryId, and districtId parameters are required'
      },
      { status: 400 }
    );
  }

  if (!isValidCity(city)) {
    return json({ error: `Unknown city: ${city}` }, { status: 400 });
  }

  try {
    const baseUrl = getBaseUrl(request, url);
    const officials = await loadOfficials(baseUrl, city);
    const officialDetails = getOfficialDetails(
      boundaryId,
      districtId,
      officials
    );

    return json(
      {
        officials: (officialDetails || []).map((o: any) => ({
          Department: o.Department,
          Area: o.Area,
          Designation: o.Designation,
          DesignationRegional: o.DesignationRegional,
          Name: o.Name,
          NameRegional: o.NameRegional,
          Phone: o.Phone,
          'E-Mail': o['E-Mail'],
          WhatsApp: o.WhatsApp,
          Twitter: o.Twitter,
          Source: o.Source,
          AreaRegional: o.AreaRegional,
          OfficeName: o.OfficeName,
          OfficeLat: o.OfficeLat,
          OfficeLng: o.OfficeLng
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
    console.error('Error in district-details API:', error);
    return json({ error: 'Failed to fetch district details' }, { status: 500 });
  }
};
