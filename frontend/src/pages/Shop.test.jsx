import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Shop from "./Shop";
import { getProducts } from "../api/products";
import { useAddToCart } from "../hooks/useAddToCart";

// Mock API and Hook dependencies
vi.mock("../api/products", () => ({
  getProducts: vi.fn(),
}));

vi.mock("../hooks/useAddToCart", () => ({
  useAddToCart: vi.fn(),
}));

const renderShop = () => render(React.createElement(Shop));

describe("Shop", () => {
  const mockProducts = [
    { id: "1", title: "Gold Necklace", price: 99.99 },
    { id: "2", title: "Silver Ring", price: 49.5 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Verifies heading and product rendering after fetching from API
  it("renders the Shop heading and displays fetched products", async () => {
    getProducts.mockResolvedValueOnce(mockProducts);
    useAddToCart.mockReturnValue(vi.fn());

    renderShop();

    // Verify main heading renders
    expect(screen.getByRole("heading", { name: /shop/i })).toBeInTheDocument();

    // Wait for async getProducts call to resolve and render cards
    await waitFor(() => {
      expect(screen.getByText("Gold Necklace")).toBeInTheDocument();
      expect(screen.getByText("Silver Ring")).toBeInTheDocument();
    });

    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("$49.50")).toBeInTheDocument();
  });

  // Test 2: Verifies clicking "Add To Cart" triggers the hook callback
  it("calls addToCart with the correct product when 'Add To Cart' button is clicked", async () => {
    const addToCart = vi.fn();
    getProducts.mockResolvedValueOnce(mockProducts);
    useAddToCart.mockReturnValue(addToCart);

    renderShop();

    // Wait for products to load onto the screen
    const buttons = await screen.findAllByRole("button", {
      name: /add to cart/i,
    });

    // Click the first button
    buttons[0].click();

    expect(addToCart).toHaveBeenCalledWith(mockProducts[0]);
  });
});
