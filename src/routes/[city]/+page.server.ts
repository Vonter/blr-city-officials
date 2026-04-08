import type { PageServerLoad } from './$types';
import { prefetchBoundaryData } from '$lib/prefetchBoundary';

export const load: PageServerLoad = async ({ url, fetch }) => {
  return prefetchBoundaryData(url, fetch);
};
