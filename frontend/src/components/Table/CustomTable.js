import useSortableTable from "../../hooks/useSortableTable.js";
import SimplePagination from '../Pagination/SimplePagination.js';
import SortableHeader from './SortableHeader.js';
import tableData from "../../mocks/mockData.js";
import filterData from "../../utils/helpers.js";
import formatDate from "../../utils/formatters.js";


export default function CustomTable({ pagination, setPagination, filters }) {
  const { sortedData, sortConfig, handleSortClick } =
    useSortableTable(tableData);

  const handleSortWithReset = (field) => {
    handleSortClick(field);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const filteredData = filterData(sortedData, filters);

  const totalItems = filteredData.length;
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const currentPageData = filteredData.slice(
    startIndex,
    startIndex + pagination.itemsPerPage,
  );

  const tableBodyData = currentPageData.map((item) => (
    <tr key={item.id}>
      <td>{formatDate(item.date)}</td>
      <td>{item.name}</td>
      <td>{item.quantity}</td>
      <td>{item.distance}</td>
    </tr>
  ));
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
              onSortClick={handleSortWithReset}
            />
            <SortableHeader
              field="quantity"
              label="Количество"
              sortConfig={sortConfig}
              onSortClick={handleSortWithReset}
            />
            <SortableHeader
              field="distance"
              label="Расстояние"
              sortConfig={sortConfig}
              onSortClick={handleSortWithReset}
            />
          </tr>
        </thead>
        <tbody>{tableBodyData}</tbody>
      </table>
      <SimplePagination
        pagination={pagination}
        setPagination={setPagination}
        totalItems={totalItems}
      />
    </>
  );
}