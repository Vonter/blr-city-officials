import { cityConfig } from '../configs/config';

export async function prefetchBoundaryData(
  url: URL,
  fetchFn: typeof fetch
): Promise<{
  prefetchedDepartment: string | null;
  prefetchedDepartmentData: any;
}> {
  const mapParam = url.searchParams.get('map');

  let prefetchedDepartmentData: any = null;

  if (mapParam) {
    try {
      const response = await fetchFn(
        `/${cityConfig.cityId}/boundaries_${mapParam}.json`
      );
      if (response.ok) {
        prefetchedDepartmentData = await response.json();
      }
    } catch (e) {
      console.error('Failed to prefetch department boundaries:', e);
    }
  }

  return {
    prefetchedDepartment: mapParam,
    prefetchedDepartmentData
  };
}
