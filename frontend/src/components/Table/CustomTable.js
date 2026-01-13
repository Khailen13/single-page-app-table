import SimplePagination from "../Pagination/SimplePagination.js";
import SortableHeader from "./SortableHeader.js";
import formatDate from "../../utils/formatters.js";

export default function CustomTable({
  data,
  pagination,
  setPagination,
  onSortClick,
  totalItems,
  sortConfig,
}) {

  return (
    <>
    <div className="rounded-4 overflow-hidden border">
      <table className="table table-light table-striped text-center fixed-columns-table rounded-4">
        <thead>
          <tr>
            <th scope="col" className="align-middle">Дата начала</th>
            <SortableHeader
              field="name"
              label="Название"
              sortConfig={sortConfig}
              onSortClick={onSortClick}
            />
            <SortableHeader
              field="quantity"
              label="Количество дней"
              sortConfig={sortConfig}
              onSortClick={onSortClick}
            />
            <SortableHeader
              field="distance"
              label="Расстояние, км"
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
      </div>

      <SimplePagination
        pagination={pagination}
        setPagination={setPagination}
        totalItems={totalItems}
      />
    </>
  );
}
