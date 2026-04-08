import { cityConfig } from '../configs/config';

export function getGroupKey(deptKey: string): string {
  const dept = cityConfig.departments[deptKey];
  if (dept?.group) return dept.group;
  return deptKey.includes('_') ? deptKey.split('_')[0] : deptKey;
}
