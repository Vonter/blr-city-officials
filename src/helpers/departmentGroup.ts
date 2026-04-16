import { cityConfig } from '../configs/config';
import { layers } from '../assets/boundaries';

export function getGroupKey(deptKey: string): string {
  const dept = cityConfig.departments[deptKey];
  if (dept?.group) return dept.group;
  return deptKey.includes('_') ? deptKey.split('_')[0] : deptKey;
}

export function findLowestLevelKey(groupKeys: string[]): string {
  const groupSet = new Set(groupKeys);

  const roots = groupKeys.filter(k => {
    const parent = layers[k]?.parentDepartment;
    return !parent || !groupSet.has(parent);
  });

  const chainRoot =
    roots.find(r => layers[r]?.childDepartments?.some(c => groupSet.has(c))) ??
    roots[0] ??
    groupKeys[0];

  let current = chainRoot;
  while (true) {
    const children = layers[current]?.childDepartments?.filter(c =>
      groupSet.has(c)
    );
    if (!children || children.length === 0) break;
    current = children[0]!;
  }

  return current;
}
