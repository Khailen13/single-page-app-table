export default function FilterPanel({ filters, setFilters, onApply, onClear }) {
  const handleApply = () => {
    console.log("Применяю фильтры:", filters);
    onApply();
  };

  const handleClear = () => {
    setFilters({ column: "", condition: "", value: "" });
    onClear();
  };
  return (
    <div className="input-group mb-3">
      <label className="input-group-text" htmlFor="inputGroupSelect01">
        Фильтрация
      </label>
      <select
        className="form-select text-center"
        id="columnSelect"
        value={filters.column}
        onChange={(e) => setFilters({ ...filters, column: e.target.value })}
      >
        <option value="">Выберите колонку...</option>
        <option value="date">Дата</option>
        <option value="name">Название</option>
        <option value="quantity">Количество</option>
        <option value="distance">Расстояние</option>
      </select>
      <select
        className="form-select text-center"
        id="conditionSelect"
        value={filters.condition}
        onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
      >
        <option value="">Выберите условие...</option>
        <option value="contains">содержит</option>
        <option value="equals">равно</option>
        <option value="greater">больше</option>
        <option value="less">меньше</option>
      </select>
      <input
        type="text"
        className="form-control text-center"
        aria-label="Text input with dropdown button"
        placeholder="Введите значение..."
        value={filters.value}
        onChange={(e) => setFilters({ ...filters, value: e.target.value })}
      />
      <div
        className="btn-group"
        role="group"
        aria-label="Basic outlined example"
      >
        <button
          type="button"
          className="btn btn-light rounded-start-0 border-secondary-subtle"
          title="Применить"
          onClick={handleApply}
        >
          <i className="bi bi-funnel"></i>
        </button>
        <button
          type="button"
          className="btn btn-light border-secondary-subtle"
          title="Очистить"
          onClick={handleClear}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  );
}