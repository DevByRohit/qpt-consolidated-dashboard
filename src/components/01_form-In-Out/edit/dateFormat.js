// ✅ FIX timezone shift
export const normalizeDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // 🔥 remove timezone shift
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

// ✅ FORMAT 1 → 24/04/2026
export const formatDDMMYYYY = (dateString) => {
  const date = normalizeDate(dateString);

  return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
};

// ✅ FORMAT 2 → 24 April 2026
export const formatPrettyDate = (dateString) => {
  const date = normalizeDate(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
