import {
  getOfficialDetails,
  getWardName,
  getWardNumber,
  isRegionalLocale
} from './helpers';

export function formatDistrictName(
  wardName: string,
  wardNumber: string
): string {
  return wardNumber ? `${wardNumber}: ${wardName}` : wardName;
}

export function getLocalizedDistrictName(
  deptKey: string,
  areaName: string,
  officials: any[],
  locale: string | null | undefined
): string {
  const officialDetails = getOfficialDetails(deptKey, areaName, officials);
  const wardNumber = getWardNumber(areaName);
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
  return formatDistrictName(name, wardNumber);
}
