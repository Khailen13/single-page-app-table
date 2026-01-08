export default function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "некорректная дата";
  return date.toLocaleDateString("ru-RU");
}