import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { vi } from "vitest";

vi.mock("../api/cart", () => ({
  getCart: vi.fn(),
}));

import { getCart } from "../api/cart";

const renderNavbar = () =>
  render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(Navbar),
    ),
  );

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the cart badge with the total quantity when items exist", async () => {
    getCart.mockResolvedValue([
      { quantity: 2 },
      { quantity: 1 },
    ]);

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("renders the navigation links and cart icon", async () => {
    getCart.mockResolvedValue([]);

    const { container } = renderNavbar();

    expect(screen.getByText("Gemini")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
    expect(container.querySelector('a[href="/cart"]')).toBeInTheDocument();
  });
});
