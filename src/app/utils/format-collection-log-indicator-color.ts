export function formatCollectionLogIndicatorColor(
  currentTabObtained: number,
  currentTabTotal: number,
  inProgressColor: 'yellow' | 'orange',
) {
  if (currentTabObtained === currentTabTotal) {
    return 'green';
  }

  if (currentTabObtained === 0) {
    return 'red';
  }

  return inProgressColor;
}
