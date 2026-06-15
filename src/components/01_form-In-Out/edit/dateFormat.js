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

// Timestamp format → 15 June 2026, 09:11 AM
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
