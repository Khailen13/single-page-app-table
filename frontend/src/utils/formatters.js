export default function formatDate(dateString) {
  if (!dateString) return "—";

  try {
    let date;

    const dmyMatch = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (dmyMatch) {
      const [_, day, month, year] = dmyMatch;
      date = new Date(year, month - 1, day);
    }

    const ymdMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymdMatch && !date) {
      const [_, year, month, day] = ymdMatch;
      date = new Date(year, month - 1, day);
    }

    if (!date) {
      if (dateString.length <= 5 && /^\d+$/.test(dateString)) {
        console.warn('Невалидная дата:', dateString);
        return "—";
      }
      date = new Date(dateString);
    }

    if (!date || isNaN(date.getTime())) {
      console.warn('Невалидная дата:', dateString);
      return "—";
    }

    return date.toLocaleDateString("ru-RU");
  } catch (error) {
    console.warn('Ошибка парсинга даты:', dateString, error);
    return "—";
  }
}