export const formatDate = (date: string) => {
  const dateObj = new Date(date);

  const day = dateObj.getUTCDate().toString().padStart(2, "0");
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getUTCFullYear().toString();

  return `${day}/${month}/${year}`;
};
