import type { LayoutLoad } from './$types';
import { allCityIds, setCity } from '../../configs/config';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = ({ params }) => {
  if (!allCityIds.includes(params.city)) {
    error(404, `Unknown city: ${params.city}`);
  }
  setCity(params.city);
  return { cityId: params.city };
};
