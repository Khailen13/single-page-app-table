import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { useState, useEffect, useRef } from "react";

import api from "./utils/api";
import SimplePagination from "./components/Pagination/SimplePagination.js";
import FilterPanel from "./components/Filters/FilterPanel.js";
import CustomTable from "./components/Table/CustomTable.js";

function App() {
  const [serverData, setServerData] = useState({ results: [], count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
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
    itemsPerPage: 15,
  });

  const loaderTimerRef = useRef(null);

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

    if (loaderTimerRef.current) {
      clearTimeout(loaderTimerRef.current);
    }

    loaderTimerRef.current = setTimeout(() => {
      setShowLoader(true);
    }, 300);

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

      const response = await api.get("/table/", { params });
      setServerData(response.data);
    } catch (err) {
      console.error("Ошибка:", err);
      setError(err.message || "Произошла ошибка при загрузке данных");
    } finally {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }

      setIsLoading(false);
      setShowLoader(false);
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

  useEffect(() => {
    return () => {
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }
    };
  }, []);

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

  return (
    <div className="bg-gradient bg-light min-vh-100 py-5">
      <div className="container">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-success bg-gradient text-white py-3">
            <h2 className="text-center mb-0">
              <i className="bi bi-compass me-2"></i>
              Туристические экспедиции
            </h2>
          </div>

          <div className="card-body p-4 position-relative">
            {showLoader && (
              <div className="text-center my-5 loader-fade position-absolute top-50 start-50 translate-middle">
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Загрузка...</span>
                </div>
                <p className="mt-2 text-muted small">Загрузка данных...</p>
              </div>
            )}

            <div className={showLoader ? "content-blur" : ""}>
              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </span>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError(null)}
                    ></button>
                  </div>
                </div>
              )}

              <FilterPanel
                filters={tempFilters}
                setFilters={setTempFilters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />

              <div className={showLoader ? "opacity-low" : "opacity-full"}>
                {!error && (
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
            </div>
          </div>

          <div className="card-footer bg-success py-3 text-center text-white small">
            <i className="bi bi-info-circle me-1"></i>
            Используйте фильтры для поиска нужных экспедиций
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
