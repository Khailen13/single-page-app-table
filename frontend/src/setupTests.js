import "@testing-library/jest-dom";

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOMTestUtils.act") ||
        args[0].includes("Warning: %s") ||
        args[0].includes("Warning: validateDOMNesting"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
