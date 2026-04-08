export function alternatingRowClass(index: number, isDark = false): string {
  return index % 2 === 0
    ? 'bg-white dark:bg-neutral-900'
    : 'bg-gray-100 dark:bg-neutral-800';
}
