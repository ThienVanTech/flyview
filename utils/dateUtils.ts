/**
 * Get the date range for the current day (from midnight to midnight)
 * @returns Object containing pastMidnight (start of current day) and nextMidnight (end of current day)
 */
export const getCurrentDayDateRange = () => {
  const pastMidnight = new Date();
  pastMidnight.setHours(0, 0, 0, 0); // Get the first midnight in the past (start of current day)
  
  // Calculate next midnight by adding 24 hours to avoid issues with month/year boundaries
  const nextMidnight = new Date(pastMidnight.getTime() + 24 * 60 * 60 * 1000);

  return { pastMidnight, nextMidnight };
};

/**
 * Format time from a Date object to HH:MM format
 * @param date The date object to format
 * @returns Formatted time string (e.g., "14:30")
 */
export const formatTime = (date: Date): string => {
  return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
};
