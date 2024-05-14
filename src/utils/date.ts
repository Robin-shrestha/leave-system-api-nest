export const calculateDaysInRange = (startDate, endDate) => {
  const date1 = new Date(startDate).valueOf();
  const date2 = new Date(endDate).valueOf();
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};
