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

/**
 * Convert timestamp into relative time.
 * Examples:
 * - Just now
 * - 2 minutes ago
 * - 1 hour ago
 * - Yesterday
 * - 5 days ago
 * - 2 months ago
 * - 1 year ago
*/
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";

  const now = new Date();
  const created = new Date(timestamp);

  const seconds = Math.floor((now - created) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 30) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(months / 12);

  return `${years} year${years > 1 ? "s" : ""} ago`;
};
