import { render, screen, fireEvent } from "@testing-library/react";
import SimplePagination from "./SimplePagination";

describe("SimplePagination", () => {
  const mockSetPagination = jest.fn();

  test("renders pagination controls", () => {
    render(
      <SimplePagination
        pagination={{ currentPage: 1, itemsPerPage: 15 }}
        setPagination={mockSetPagination}
        totalItems={100}
      />,
    );

    expect(screen.getByText("15 элементов на странице")).toBeInTheDocument();
  });

  beforeEach(() => {
    mockSetPagination.mockClear();
  });

  test("prev button is disabled on first page", () => {
    render(
      <SimplePagination
        pagination={{ currentPage: 1, itemsPerPage: 15 }}
        setPagination={mockSetPagination}
        totalItems={100}
      />,
    );

    const prevButton = screen.getByLabelText("Previous page");
    expect(prevButton).toBeDisabled();
  });

  test("next button is disabled on last page", () => {
    render(
      <SimplePagination
        pagination={{ currentPage: 7, itemsPerPage: 15 }}
        setPagination={mockSetPagination}
        totalItems={100}
      />,
    );

    const nextButton = screen.getByLabelText("Next page");
    expect(nextButton).toBeDisabled();
  });

  test("clicking prev button decrements page", () => {
    render(
      <SimplePagination
        pagination={{ currentPage: 2, itemsPerPage: 15 }}
        setPagination={mockSetPagination}
        totalItems={100}
      />,
    );

    const prevButton = screen.getByLabelText("Previous page");
    fireEvent.click(prevButton);

    expect(mockSetPagination).toHaveBeenCalledWith({
      currentPage: 1, // Должна стать первая страница
      itemsPerPage: 15,
    });
  });

  test("clicking next button increments page", () => {
    render(
      <SimplePagination
        pagination={{ currentPage: 1, itemsPerPage: 15 }}
        setPagination={mockSetPagination}
        totalItems={100}
      />,
    );

    const nextButton = screen.getByLabelText("Next page");
    fireEvent.click(nextButton);

    expect(mockSetPagination).toHaveBeenCalledWith({
      currentPage: 2,
      itemsPerPage: 15,
    });
  });

  test("changing items per page resets to page 1", () => {
    render(
      <SimplePagination
        pagination={{ currentPage: 3, itemsPerPage: 15 }}
        setPagination={mockSetPagination}
        totalItems={100}
      />,
    );

    const select = screen.getByDisplayValue("15 элементов на странице");
    fireEvent.change(select, { target: { value: "10" } });

    expect(mockSetPagination).toHaveBeenCalledWith({
      currentPage: 1,
      itemsPerPage: 10,
    });
  });

  test("page input navigation works", () => {
    render(
      <SimplePagination
        pagination={{ currentPage: 1, itemsPerPage: 15 }}
        setPagination={mockSetPagination}
        totalItems={100}
      />,
    );

    const input = screen.getByPlaceholderText("Страница");
    fireEvent.change(input, { target: { value: "5" } });

    const goButton = screen.getByLabelText("Go to page");
    fireEvent.click(goButton);

    expect(mockSetPagination).toHaveBeenCalledWith({
      currentPage: 5,
      itemsPerPage: 15,
    });
  });

  test("page input shows alert for invalid page", () => {
    window.alert = jest.fn();

    render(
      <SimplePagination
        pagination={{ currentPage: 1, itemsPerPage: 15 }}
        setPagination={mockSetPagination}
        totalItems={100}
      />,
    );

    const input = screen.getByPlaceholderText("Страница");
    fireEvent.change(input, { target: { value: "999" } });

    const goButton = screen.getByLabelText("Go to page");
    fireEvent.click(goButton);

    expect(window.alert).toHaveBeenCalledWith("Введите число от 1 до 7");

    expect(mockSetPagination).not.toHaveBeenCalled();
  });
});
