export const getDuration = (
  duration: number,
  unit: 'days' | 'weeks' | 'months' | 'years'
) => {
  switch (unit) {
    case 'days':
      return duration * 24 * 3600;
    case 'weeks':
      return duration * 7 * 24 * 3600;
    case 'months':
      return duration * 30 * 24 * 3600;
    case 'years':
      return duration * 365 * 24 * 3600;
    default:
      return duration;
  }
};
