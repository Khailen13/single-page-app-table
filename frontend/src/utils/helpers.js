export default function filterData(data, filters) {
  if (!filters) return data;

  if (!filters.column || !filters.condition || !filters.value) {
    return data;
  }

  return data.filter((item) => {
    const value = item[filters.column];
    const filterValue = filters.value.toLowerCase();

    switch (filters.condition) {
      case "contains":
        return String(value).toLowerCase().includes(filterValue);
      case "equals":
        return String(value).toLowerCase() === filterValue;
      case "greater":
        return Number(value) > Number(filterValue);
      case "less":
        return Number(value) < Number(filterValue);
      default:
        return true;
    }
  });
}
