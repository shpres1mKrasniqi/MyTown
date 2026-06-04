export function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
