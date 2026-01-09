/**
 * Get the date range for the current day (from midnight to midnight)
 * @returns Object containing pastMidnight (start of current day) and nextMidnight (end of current day)
 */
export const getCurrentDayDateRange = () => {
  const pastMidnight = new Date();
  pastMidnight.setHours(0, 0, 0, 0); // Get the first midnight in the past (start of current day)
  
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0); // Get the first midnight in the future (end of current day)

  return { pastMidnight, nextMidnight };
};
