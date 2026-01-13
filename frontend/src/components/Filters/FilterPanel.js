import { useState, useEffect } from "react";

export default function FilterPanel({ filters, setFilters, onApply, onClear }) {
  const columnConditions = {
    date: [
      { value: "equals", label: "равно", available: true },
      { value: "greater", label: "больше", available: true },
      { value: "less", label: "меньше", available: true },
      { value: "contains", label: "содержит", available: false },
    ],
    name: [
      { value: "contains", label: "содержит", available: true },
      { value: "equals", label: "равно", available: true },
      { value: "greater", label: "больше", available: false },
      { value: "less", label: "меньше", available: false },
    ],
    quantity: [
      { value: "equals", label: "равно", available: true },
      { value: "greater", label: "больше", available: true },
      { value: "less", label: "меньше", available: true },
      { value: "contains", label: "содержит", available: false },
    ],
    distance: [
      { value: "equals", label: "равно", available: true },
      { value: "greater", label: "больше", available: true },
      { value: "less", label: "меньше", available: true },
      { value: "contains", label: "содержит", available: false },
    ],
  };
  const placeholders = {
    date: "Введите дату в формате 'ДД.ММ.ГГГГ'",
    name: "Введите текст...",
    quantity: "Введите число (только цифры)",
    distance: "Введите число (только цифры)",
  };
  const validateInput = (value, column) => {
    if (!value) return true;

    switch (column) {
      case "date":
        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
        return dateRegex.test(value);

      case "quantity":
      case "distance":
        return !isNaN(parseFloat(value)) && isFinite(value);

      case "name":
      default:
        return true;
    }
  };
  const handleValueChange = (e) => {
    const value = e.target.value;
    const column = filters.column;

    if (!column) {
      setFilters({ ...filters, value });
      return;
    }

    if (column === "quantity" || column === "distance") {
      const numericRegex = /^-?\d*\.?\d*$/;
      if (numericRegex.test(value) || value === "") {
        setFilters({ ...filters, value });
      }
    } else if (column === "date") {
      let formattedValue = value;

      formattedValue = formattedValue.replace(/\D/g, "");

      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.slice(0, 2) + "." + formattedValue.slice(2);
      }
      if (formattedValue.length > 5) {
        formattedValue =
          formattedValue.slice(0, 5) + "." + formattedValue.slice(5);
      }
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }

      setFilters({ ...filters, value: formattedValue });
    } else {
      setFilters({ ...filters, value });
    }
  };

  const handleColumnChange = (e) => {
    const newColumn = e.target.value;
    setFilters({
      column: newColumn,
      condition: "",
      value: "",
    });
  };

  const getAvailableConditions = () => {
    if (!filters.column) return [];
    return columnConditions[filters.column] || [];
  };

  const canApplyFilter = () => {
    if (!filters.column || !filters.condition || !filters.value.trim()) {
      return false;
    }

    return validateInput(filters.value, filters.column);
  };

  const getPlaceholder = () => {
    if (!filters.column) return "Введите значение...";
    return placeholders[filters.column] || "Введите значение...";
  };

  const handleApply = () => {
    console.log("Применяю фильтры:", filters);
    onApply();
  };

  const handleClear = () => {
    setFilters({ column: "", condition: "", value: "" });
    onClear();
  };

  const isValueValid = validateInput(filters.value, filters.column);

  return (
    <div className="mb-4">
      <div className="input-group mb-1">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          Фильтрация
        </label>

        {/* Выбор колонки */}
        <select
          className="form-select text-center"
          id="columnSelect"
          value={filters.column}
          onChange={handleColumnChange}
        >
          <option value="">Колонка...</option>
          <option value="date">Дата</option>
          <option value="name">Название</option>
          <option value="quantity">Количество</option>
          <option value="distance">Расстояние</option>
        </select>

        {/* Выбор условия (динамический) */}
        <select
          className="form-select text-center"
          id="conditionSelect"
          value={filters.condition}
          onChange={(e) =>
            setFilters({ ...filters, condition: e.target.value })
          }
          disabled={!filters.column}
        >
          <option value="">Условие...</option>
          {getAvailableConditions().map((condition) => (
            <option
              key={condition.value}
              value={condition.value}
              disabled={!condition.available}
              style={{
                color: condition.available ? "" : "#6c757d",
                fontStyle: condition.available ? "normal" : "italic",
              }}
            >
              {condition.label}
              {!condition.available && " (недоступно)"}
            </option>
          ))}
        </select>

        {/* Поле ввода значения */}
        <input
          type="text"
          className={`form-control text-center ${filters.value && !isValueValid ? "is-invalid" : ""}`}
          aria-label="Text input with dropdown button"
          placeholder={getPlaceholder()}
          value={filters.value}
          onChange={handleValueChange}
          onKeyDown={(e) =>
            e.key === "Enter" && canApplyFilter() && handleApply()
          }
          disabled={!filters.column || !filters.condition}
        />

        {/* Кнопки */}
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-start-0"
            title="Применить фильтр"
            onClick={handleApply}
            disabled={!canApplyFilter()}
          >
            <i className="bi bi-funnel"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            title="Очистить фильтры"
            onClick={handleClear}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      {/* Сообщение об ошибке ввода */}
      {filters.value && !isValueValid && (
        <div className="text-danger small mt-1">
          <i className="bi bi-exclamation-circle me-1"></i>
          {filters.column === "date"
            ? "Используйте формат 'ДД.ММ.ГГГГ'"
            : "Введите корректное число"}
        </div>
      )}
    </div>
  );
}
