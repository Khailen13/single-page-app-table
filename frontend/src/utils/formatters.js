export default function formatDate(dateString) {
  if (!dateString) return "—";

  try {
    let date;

    // 1. Пробуем формат DD-MM-YYYY (ваш текущий)
    const dmyMatch = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (dmyMatch) {
      const [_, day, month, year] = dmyMatch;
      date = new Date(year, month - 1, day);
    }

    // 2. Пробуем формат YYYY-MM-DD (ISO)
    const ymdMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymdMatch && !date) {
      const [_, year, month, day] = ymdMatch;
      date = new Date(year, month - 1, day);
    }

    // 3. Пробуем стандартный парсинг
    if (!date) {
      date = new Date(dateString);
    }

    // Проверяем валидность
    if (!date || isNaN(date.getTime())) {
      console.warn('Невалидная дата:', dateString);
      return "—";
    }

    // Форматируем в русский формат
    return date.toLocaleDateString("ru-RU");
  } catch (error) {
    console.warn('Ошибка парсинга даты:', dateString, error);
    return "—";
  }
}