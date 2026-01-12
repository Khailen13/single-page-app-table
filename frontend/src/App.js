import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { useState, useEffect } from "react";

import api from "./utils/api";
import SimplePagination from "./components/Pagination/SimplePagination.js";
import FilterPanel from "./components/Filters/FilterPanel.js";
import CustomTable from "./components/Table/CustomTable.js";

function App() {
  const [serverData, setServerData] = useState({ results: [], count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: "asc",
  });
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

  const getDjangoFilterParams = (filters) => {
    if (!filters.column || !filters.condition || !filters.value) {
      return {};
    }

    const { column, condition, value } = filters;

    if (condition === "equals") {
      return { [column]: value };
    }

    const suffixMap = {
      contains: "__icontains",
      greater: "__gt",
      less: "__lt",
    };

    const suffix = suffixMap[condition];
    if (!suffix) return {};

    return { [`${column}${suffix}`]: value };
  };

  const fetchTableData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.currentPage,
        page_size: pagination.itemsPerPage,
      };

      if (sortConfig.field) {
        params.ordering =
          sortConfig.direction === "desc"
            ? `-${sortConfig.field}`
            : sortConfig.field;
      }

      const filterParams = getDjangoFilterParams(appliedFilters);
      Object.assign(params, filterParams);

      const fullUrl = `http://localhost/spa/table/?${new URLSearchParams(params).toString()}`;
      console.log("Пробую загрузить данные по адресу:", fullUrl);

      const response = await api.get("/table/", { params });
      console.log("Ответ от сервера:", response.data);
      setServerData(response.data);
    } catch (err) {
      console.error("Полная информация об ошибке:", {
        message: err.message,
        response: err.response,
        request: err.request,
        config: err.config,
      });
      setError(err.message || "Произошла ошибка при загрузке данных");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    sortConfig,
    appliedFilters,
  ]);

  const resetPagination = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        field,
        direction: "asc",
      };
    });
    resetPagination();
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

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3"> Туристические экспедиции </h2>
      {isLoading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <FilterPanel
        filters={tempFilters}
        setFilters={setTempFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {!isLoading && !error && (
        <CustomTable
          data={serverData.results}
          pagination={pagination}
          setPagination={setPagination}
          onSortClick={handleSort}
          totalItems={serverData.count}
          sortConfig={sortConfig}
        />
      )}
    </div>
  );
}

export default App;
