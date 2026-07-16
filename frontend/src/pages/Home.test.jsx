import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { products } from "../data/products";
import { useAddToCart } from "../hooks/useAddToCart";

vi.mock("../hooks/useAddToCart", () => ({
  useAddToCart: vi.fn(),
}));

describe("Home", () => {
  it("renders the hero heading and a card for every featured product", () => {
    useAddToCart.mockReturnValue(vi.fn());

    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /featured collection/i }),
    ).toBeInTheDocument();

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("calls addToCart with the product when its Add to Cart button is clicked", async () => {
    const addToCart = vi.fn();
    useAddToCart.mockReturnValue(addToCart);

    render(<Home />);

    const buttons = screen.getAllByRole("button", { name: /add to cart/i });
    buttons[0].click();

    expect(addToCart).toHaveBeenCalledWith(products[0]);
  });
});
