import { render, screen, fireEvent } from "@testing-library/react";
import FilterPanel from "./FilterPanel";

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
});

describe("FilterPanel", () => {
  const mockSetFilters = jest.fn();
  const mockOnApply = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders basic elements", () => {
    render(
      <FilterPanel
        filters={{ column: "", condition: "", value: "" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    expect(screen.getByText("Фильтрация")).toBeInTheDocument();
    expect(screen.getByText("Колонка...")).toBeInTheDocument();
    expect(screen.getByText("Условие...")).toBeInTheDocument();
  });

  test("calls onApply when apply button is clicked", () => {
    render(
      <FilterPanel
        filters={{ column: "name", condition: "contains", value: "test" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    const applyButton = screen.getByTitle("Применить фильтр");
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });

  test("validates date format with regex correctly", () => {
    render(
      <FilterPanel
        filters={{ column: "date", condition: "equals", value: "" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    const input = screen.getByPlaceholderText(/ДД.ММ.ГГГГ/i);

    fireEvent.change(input, { target: { value: "31" } });
    expect(mockSetFilters).toHaveBeenCalledWith(
      expect.objectContaining({ value: "31" }),
    );

    mockSetFilters.mockClear();

    fireEvent.change(input, { target: { value: "3112" } });
    expect(mockSetFilters).toHaveBeenCalledWith(
      expect.objectContaining({ value: "31.12" }),
    );
  });

  test("validateInput function works for all column types", () => {
    render(
      <FilterPanel
        filters={{ column: "quantity", condition: "equals", value: "" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    const input = screen.getByPlaceholderText(/Введите число/i);

    fireEvent.change(input, { target: { value: "123" } });
    expect(mockSetFilters).toHaveBeenCalledWith(
      expect.objectContaining({ value: "123" }),
    );

    mockSetFilters.mockClear();
    fireEvent.change(input, { target: { value: "abc" } });

    expect(mockSetFilters).toHaveBeenCalledTimes(0);
  });

  test("apply button enabled/disabled states", () => {
    const { rerender } = render(
      <FilterPanel
        filters={{ column: "name", condition: "contains", value: "" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    let applyButton = screen.getByTitle("Применить фильтр");
    expect(applyButton).toBeDisabled();

    rerender(
      <FilterPanel
        filters={{ column: "name", condition: "contains", value: "test" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    applyButton = screen.getByTitle("Применить фильтр");
    expect(applyButton).not.toBeDisabled();

    rerender(
      <FilterPanel
        filters={{ column: "quantity", condition: "equals", value: "abc" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    applyButton = screen.getByTitle("Применить фильтр");
    expect(applyButton).toBeDisabled();
  });

  test("shows error message for invalid numeric input", () => {
    render(
      <FilterPanel
        filters={{
          column: "quantity",
          condition: "equals",
          value: "not-a-number",
        }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    const errorMessage = screen.getByText(/Введите корректное число/i);
    expect(errorMessage).toBeInTheDocument();

    expect(errorMessage.innerHTML).toContain("bi-exclamation-circle");
  });

  test("validates date input and shows appropriate UI", () => {
    render(
      <FilterPanel
        filters={{ column: "date", condition: "equals", value: "31.12.2023" }} // Валидная дата
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    const input = screen.getByPlaceholderText(/ДД.ММ.ГГГГ/i);

    expect(input.value).toBe("31.12.2023");

    expect(input).not.toHaveClass("is-invalid");

    const applyButton = screen.getByTitle("Применить фильтр");
  });

  test("calls onClear and resets filters when clear button clicked", () => {
    render(
      <FilterPanel
        filters={{ column: "name", condition: "contains", value: "test" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    const clearButton = screen.getByTitle("Очистить фильтры");
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
    // И установить пустые фильтры через setFilters
    expect(mockSetFilters).toHaveBeenCalledWith({
      column: "",
      condition: "",
      value: "",
    });
  });

  test("shows different conditions based on selected column", () => {
    const { rerender } = render(
      <FilterPanel
        filters={{ column: "name", condition: "", value: "" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    const conditionSelect = screen.getByDisplayValue("Условие...");
    expect(conditionSelect).toHaveTextContent("содержит");
    expect(conditionSelect).toHaveTextContent("равно");

    rerender(
      <FilterPanel
        filters={{ column: "quantity", condition: "", value: "" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    expect(conditionSelect).toHaveTextContent("равно");
    expect(conditionSelect).toHaveTextContent("больше");
    expect(conditionSelect).toHaveTextContent("меньше");
  });

  test("handles Enter key press in value field", () => {
    render(
      <FilterPanel
        filters={{ column: "name", condition: "contains", value: "test" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    const input = screen.getByPlaceholderText(/Введите текст/i);

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });

  test("disables value input when column or condition not selected", () => {
    const { rerender } = render(
      <FilterPanel
        filters={{ column: "", condition: "", value: "" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    let input = screen.getByPlaceholderText("Введите значение...");
    expect(input).toBeDisabled();

    rerender(
      <FilterPanel
        filters={{ column: "name", condition: "", value: "" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    input = screen.getByPlaceholderText(/Введите текст/i);
    expect(input).toBeDisabled();

    rerender(
      <FilterPanel
        filters={{ column: "name", condition: "contains", value: "" }}
        setFilters={mockSetFilters}
        onApply={mockOnApply}
        onClear={mockOnClear}
      />,
    );

    input = screen.getByPlaceholderText(/Введите текст/i);
    expect(input).not.toBeDisabled();
  });
});
