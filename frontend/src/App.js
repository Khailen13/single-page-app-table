import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { useState } from "react";

import useSortableTable from "./hooks/useSortableTable.js";
import tableData from "./mocks/mockData.js";
import filterData from "./utils/helpers.js";
import SimplePagination from "./components/Pagination/SimplePagination.js";
import FilterPanel from "./components/Filters/FilterPanel.js";
import CustomTable from "./components/Table/CustomTable.js";

function App() {
  const [tempFilters, setTempFilters] = useState({
    column: "",
    condition: "",
    value: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    column: "",
    condition: "",
    value: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
  });

  const resetPagination = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    resetPagination();
  };

  const handleClearFilters = () => {
    const emptyFilters = { column: "", condition: "", value: "" };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    resetPagination();
  };

  return (
    <div className="container mt-4 ">
      <h2 className="text-center mb-4 text-black">Экспедиции</h2>
      <FilterPanel
        filters={tempFilters}
        setFilters={setTempFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
      <CustomTable
        pagination={pagination}
        setPagination={setPagination}
        filters={appliedFilters}
      />
    </div>
  );
}

export default App;
