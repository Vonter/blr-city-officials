import {
  getOfficialDetails,
  getWardName,
  getBoundaryNumber,
  isRegionalLocale
} from './helpers';

export function formatDistrictName(
  wardName: string,
  boundaryNumber: string
): string {
  return boundaryNumber ? `${boundaryNumber}: ${wardName}` : wardName;
}

export function getLocalizedDistrictName(
  deptKey: string,
  areaName: string,
  officials: any[],
  locale: string | null | undefined,
  boundaryNumber?: string
): string {
  const officialDetails = getOfficialDetails(deptKey, areaName, officials);
  const num = boundaryNumber ?? getBoundaryNumber(areaName);
  let name: string;
  if (
    officialDetails &&
    officialDetails.length > 0 &&
    officialDetails[0]?.AreaRegional &&
    isRegionalLocale(locale)
  ) {
    name = getWardName(officialDetails[0].AreaRegional);
  } else {
    name = getWardName(areaName);
  }
  return formatDistrictName(name, num);
}
