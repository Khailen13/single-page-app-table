import { useState, useMemo } from "react";

export default function useSortableTable(data) {
  const [sortConfig, setSortConfig] = useState(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const multiplier = sortConfig.direction === "asc" ? 1 : -1;
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      // Если значения равны
      if (aValue === bValue) return 0;

      // Если одно из значений null/undefined
      if (aValue == null) return 1 * multiplier;
      if (bValue == null) return -1 * multiplier;

      // Для чисел
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * multiplier;
      }

      // Для строк (с учетом русского языка)
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue, "ru") * multiplier;
      }
    });
  }, [data, sortConfig]);

  const handleSortClick = (field) => {
    setSortConfig((prev) => {
      if (prev && prev.field === field) {
        return {
          field,
          direction: prev.direction == "asc" ? "desc" : "asc",
        };
      }
      return {
        field,
        direction: "asc",
      };
    });
  };
  return { sortedData, sortConfig, handleSortClick };
}
