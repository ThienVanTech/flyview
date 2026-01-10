/**
 * Get the date range for displaying flights (from today to 7 days ahead)
 * This allows showing flights scheduled for upcoming days, not just today
 * @returns Object containing pastMidnight (start of current day) and futureDate (7 days from now)
 */
export const getCurrentDayDateRange = () => {
  const pastMidnight = new Date();
  pastMidnight.setHours(0, 0, 0, 0); // Get the first midnight in the past (start of current day)
  
  // Get date range for next 7 days to show upcoming flights
  const futureDate = new Date(pastMidnight.getTime() + 7 * 24 * 60 * 60 * 1000);

  return { pastMidnight, nextMidnight: futureDate };
};

/**
 * Format time from a Date object to HH:MM format
 * @param date The date object to format
 * @returns Formatted time string (e.g., "14:30")
 */
export const formatTime = (date: Date): string => {
  return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
};
