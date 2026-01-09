import SimplePagination from "../Pagination/SimplePagination.js";
import SortableHeader from "./SortableHeader.js";
import formatDate from "../../utils/formatters.js"; // Исправил путь

export default function CustomTable({
  data,
  pagination,
  setPagination,
  onSortClick,
  totalItems,
  sortConfig,
}) {
  // data уже содержит только данные для текущей страницы (пришли с сервера)
  // Не нужно делать slice на клиенте!

  return (
    <>
      <table className="table table-dark table-striped text-center">
        <thead>
          <tr>
            <th scope="col">Дата</th>
            <SortableHeader
              field="name"
              label="Название"
              sortConfig={sortConfig}
              onSortClick={onSortClick}
            />
            <SortableHeader
              field="quantity"
              label="Количество"
              sortConfig={sortConfig}
              onSortClick={onSortClick}
            />
            <SortableHeader
              field="distance"
              label="Расстояние"
              sortConfig={sortConfig}
              onSortClick={onSortClick}
            />
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{formatDate(item.date)}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SimplePagination
        pagination={pagination}
        setPagination={setPagination}
        totalItems={totalItems}
      />
    </>
  );
}
