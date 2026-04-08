import { cityConfig } from '../configs/config';

export const colors = {
  selected: '#818cf8',
  'dark-selected': '#4b5563',
  default: '#2463eb',
  'dark-default': '#b3bac5'
};

export function getBoundaryColor(
  departmentKey: string,
  darkMode: boolean
): string {
  const dept = cityConfig.departments[departmentKey];
  if (dept?.color && !darkMode) return dept.color;
  if (dept?.darkColor && darkMode) return dept.darkColor;
  return darkMode ? colors['dark-default'] : colors['default'];
}
