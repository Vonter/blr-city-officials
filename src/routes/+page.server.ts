import type { PageServerLoad } from './$types';
import { isAllCitiesMode, setCity } from '../configs/config';
import { prefetchBoundaryData } from '$lib/prefetchBoundary';

export const load: PageServerLoad = async ({ url, fetch }) => {
  if (isAllCitiesMode) {
    setCity('blr');
  }

  return prefetchBoundaryData(url, fetch);
};
