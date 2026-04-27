jest.mock("./App.css", () => ({}));
jest.mock("bootstrap/dist/css/bootstrap.min.css", () => ({}));
jest.mock("bootstrap-icons/font/bootstrap-icons.css", () => ({}));

jest.mock("./components/Filters/FilterPanel");
jest.mock("./components/Table/CustomTable");
jest.mock("./components/Pagination/SimplePagination");

jest.mock("./utils/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() =>
      Promise.resolve({
        data: { results: [], count: 0 },
      }),
    ),
  },
}));

import { render, screen } from "@testing-library/react";
import App from "./App";

test("App renders title", async () => {
  render(<App />);

  await new Promise((resolve) => setTimeout(resolve, 100));

  const title = screen.getByText(/Туристические экспедиции/i);
  expect(title).toBeInTheDocument();
});
