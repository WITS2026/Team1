import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "./Home";
import { getProducts } from "../api/products";
import { useAddToCart } from "../hooks/useAddToCart";

vi.mock("../api/products", () => ({
  getProducts: vi.fn(),
}));

vi.mock("../hooks/useAddToCart", () => ({
  useAddToCart: vi.fn(),
}));

const mockProducts = [
  { id: 1, title: "Diamond Ring", price: 999, imageUrl: "https://example.com/ring.jpg" },
  { id: 2, title: "Gold Necklace", price: 799, imageUrl: "https://example.com/necklace.jpg" },
];

const renderHome = () => render(React.createElement(Home));

describe("Home", () => {
  it("renders the hero heading and a card for every featured product", async () => {
    useAddToCart.mockReturnValue(vi.fn());
    getProducts.mockResolvedValueOnce(mockProducts);

    renderHome();

    expect(screen.getByRole("heading", { name: /featured collection/i })).toBeInTheDocument();

    await waitFor(() => {
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.title)).toBeInTheDocument();
      });
    });
  });

  it("calls addToCart with the product when its Add to Cart button is clicked", async () => {
    const addToCart = vi.fn();
    useAddToCart.mockReturnValue(addToCart);
    getProducts.mockResolvedValueOnce(mockProducts);

    renderHome();

    await waitFor(() => expect(screen.getAllByRole("button", { name: /add to cart/i }).length).toBeGreaterThan(0));

    const buttons = screen.getAllByRole("button", { name: /add to cart/i });
    buttons[0].click();

    expect(addToCart).toHaveBeenCalledWith(mockProducts[0]);
  });
});
