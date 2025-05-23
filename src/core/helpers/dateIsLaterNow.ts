export const dateIsLaterNow = (date: Date): boolean => {
  const now = new Date();
  return date.getTime() > now.getTime();
}