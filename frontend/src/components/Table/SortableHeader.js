export default function SortableHeader({
  field,
  label,
  sortConfig,
  onSortClick,
  className = "",
}) {
  const getIcon = () => {
    if (!sortConfig || sortConfig.field !== field)
      return <i className="bi bi-arrows-vertical"></i>;
    if (sortConfig.direction === "asc")
      return <i className="bi bi-sort-down-alt"></i>;
    return <i className="bi bi-sort-down"></i>;
  };

  return (
    <th
      scope="col"
      className={`align-middle text-center ${className}`}
      onClick={() => onSortClick(field)}
      style={{ cursor: "pointer" }}
    >
      {label} {getIcon()}
    </th>
  );
}
