import type { PageLoad } from './$types';
import {
  selectedBoundaryMap,
  selectedCoordinates,
  selectedDistrict,
  loadOfficialsData
} from '../../stores';
import { getLngLat } from '../../helpers/helpers';
import { browser } from '$app/environment';
import { getLocaleFromNavigator } from 'svelte-i18n';

interface PageData {
  initialLocale: string;
  searchParams: {
    dist: string | null;
    map: string | null;
    coords: { lng: number; lat: number } | null;
  };
  prefetchedDepartment: string | null;
  prefetchedDepartmentData: any;
}

export const load: PageLoad<PageData> = ({ url, data }) => {
  const params = url.searchParams;

  const searchParams = {
    dist: params.get('dist'),
    map: params.get('map'),
    coords: getLngLat(params)
  };

  if (searchParams.dist) selectedDistrict.set(searchParams.dist);
  if (searchParams.map) selectedBoundaryMap.set(searchParams.map);
  if (searchParams.coords) selectedCoordinates.set(searchParams.coords);

  if (browser) loadOfficialsData();

  return {
    initialLocale: browser ? (getLocaleFromNavigator() ?? 'en') : 'en',
    searchParams,
    prefetchedDepartment: data?.prefetchedDepartment ?? null,
    prefetchedDepartmentData: data?.prefetchedDepartmentData ?? null
  };
};
