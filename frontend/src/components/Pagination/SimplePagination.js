import { useState } from "react";

export default function SimplePagination({
  pagination,
  setPagination,
  totalItems,
}) {
  const [pageInput, setPageInput] = useState("");
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

  const goToPrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination({ ...pagination, currentPage: pagination.currentPage - 1 });
    }
  };

  const goToNextPage = () => {
    if (pagination.currentPage < totalPages) {
      setPagination({ ...pagination, currentPage: pagination.currentPage + 1 });
    }
  };

  const handleItemsPerPageChange = (e) => {
    setPagination({
      currentPage: 1,
      itemsPerPage: parseInt(e.target.value),
    });
  };

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPageInput(value);
    }
  };

  const goToSpecificPage = () => {
    const pageNum = parseInt(pageInput);
    if (!pageNum || pageNum < 1 || pageNum > totalPages) {
      alert(`Введите число от 1 до ${totalPages}`);
      return;
    }
    setPagination({ ...pagination, currentPage: pageNum });
    setPageInput("");
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div>
        <select
          className="form-select"
          value={pagination.itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value="5">5 элементов на странице</option>
          <option value="10">10 элементов на странице</option>
          <option value="15">15 элементов на странице</option>
          <option value="20">20 элементов на странице</option>
        </select>
      </div>

      <div className="d-flex align-items-center">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={goToPrevPage}
          disabled={pagination.currentPage === 1}
          aria-label="Previous page"
        >
          <i className="bi bi-caret-left"></i>
        </button>
        <span className="mx-3">
          Страница {pagination.currentPage} из {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary ms-2"
          onClick={goToNextPage}
          disabled={pagination.currentPage === totalPages}
          aria-label="Next page"
        >
          <i className="bi bi-caret-right"></i>
        </button>
      </div>
      <div className="d-flex align-items-center" style={{ width: "200px" }}>
        <input
          type="text"
          className="form-control text-center"
          placeholder="Страница"
          value={pageInput}
          onChange={handlePageInputChange}
          onKeyDown={(e) => e.key === "Enter" && goToSpecificPage()}
        />
        <button
          className="btn btn-outline-secondary ms-2"
          onClick={goToSpecificPage}
          disabled={!pageInput}
          aria-label="Go to page"
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
