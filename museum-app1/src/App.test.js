import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders Login page", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  const signInHeader = screen.getByRole("heading", { name: /Sign in/i });
  expect(signInHeader).toBeInTheDocument();
});
