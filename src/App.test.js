import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders initial screen", () => {
  render(<App />);
  const titleText = screen.getByText(/Upload your CSV event data file/i);
  expect(titleText).toBeInTheDocument();
});
