import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartComponent from "./CartComponent";
import * as orderService from "../../service/order.service";

jest.mock("../../service/order.service");

const mockCreateOrderRequest = orderService.createOrderRequest as jest.Mock;

const defaultProps = {
  brand: "Tesla",
  model: "Model 3",
  price: 500,
  type: "rent" as const,
  folderId: 1,
  vehicleId: 2,
};

describe("CartComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the cart header with title", () => {
      render(<CartComponent {...defaultProps} />);
      expect(screen.getByText("Panier")).toBeInTheDocument();
      expect(
        screen.getByText("Vérifiez votre panier avant de procéder au paiement")
      ).toBeInTheDocument();
    });

    it("displays vehicle information", () => {
      render(<CartComponent {...defaultProps} />);
      expect(screen.getByText("Tesla")).toBeInTheDocument();
      expect(screen.getByText("Model 3")).toBeInTheDocument();
    });

    it("displays correct price for rental", () => {
      const { container } = render(<CartComponent {...defaultProps} />);
      const priceElement = container.querySelector(".price");
      expect(priceElement?.textContent).toContain("500.00");
      expect(container.textContent).toContain("/mois");
    });

    it("displays correct price for sale", () => {
      const { container } = render(
        <CartComponent {...{ ...defaultProps, type: "sale" }} />
      );
      const priceElement = container.querySelector(".price");
      expect(priceElement?.textContent).toContain("500.00");
      expect(screen.getByText("Comptant")).toBeInTheDocument();
    });

    it("displays rental type label", () => {
      render(<CartComponent {...defaultProps} />);
      expect(screen.getByText("Location")).toBeInTheDocument();
    });

    it("displays sale type label", () => {
      render(<CartComponent {...{ ...defaultProps, type: "sale" }} />);
      expect(screen.getByText("Achat")).toBeInTheDocument();
    });

    it("shows available options for rental", () => {
      render(<CartComponent {...defaultProps} />);
      expect(screen.getByText("Assurance")).toBeInTheDocument();
      expect(screen.getByText("Contrôle technique")).toBeInTheDocument();
      expect(screen.getByText("Entretien")).toBeInTheDocument();
      expect(screen.getByText("Assistance dépannage")).toBeInTheDocument();
    });

    it("does not show options section for sale type", () => {
      render(<CartComponent {...{ ...defaultProps, type: "sale" }} />);
      expect(screen.queryByText("Options disponibles")).not.toBeInTheDocument();
    });

    it("renders validate button", () => {
      render(<CartComponent {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Valider le panier/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Price Calculations", () => {
    it("calculates total with options", () => {
      const { container } = render(<CartComponent {...defaultProps} />);
      const assuranceCheckbox = screen.getByRole("checkbox", {
        name: /Assurance/i,
      });
      fireEvent.click(assuranceCheckbox);
      const totalSection = container.querySelector(".totalSection");
      expect(totalSection?.textContent).toContain("550.00");
    });

    it("calculates correct total with multiple options", () => {
      const { container } = render(<CartComponent {...defaultProps} />);
      const assuranceCheckbox = screen.getByRole("checkbox", {
        name: /Assurance/i,
      });
      const controleCheckbox = screen.getByRole("checkbox", {
        name: /Contrôle technique/i,
      });
      fireEvent.click(assuranceCheckbox);
      fireEvent.click(controleCheckbox);
      const totalSection = container.querySelector(".totalSection");
      expect(totalSection?.textContent).toContain("555.00");
    });

    it("handles string price input", () => {
      const { container } = render(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <CartComponent {...{ ...defaultProps, price: "1000" as any }} />
      );
      const priceElement = container.querySelector(".price");
      expect(priceElement?.textContent).toContain("1000.00");
    });
  });

  describe("Option Selection", () => {
    it("toggles option selection on checkbox click", () => {
      render(<CartComponent {...defaultProps} />);
      const assuranceCheckbox = screen.getByRole("checkbox", {
        name: /Assurance/i,
      }) as HTMLInputElement;

      expect(assuranceCheckbox.checked).toBe(false);
      fireEvent.click(assuranceCheckbox);
      expect(assuranceCheckbox.checked).toBe(true);
      fireEvent.click(assuranceCheckbox);
      expect(assuranceCheckbox.checked).toBe(false);
    });

    it("shows selected options summary", () => {
      render(<CartComponent {...defaultProps} />);
      const assuranceCheckbox = screen.getByRole("checkbox", {
        name: /Assurance/i,
      });
      fireEvent.click(assuranceCheckbox);
      expect(screen.getByText("Récapitulatif des options")).toBeInTheDocument();
    });

    it("does not show summary when no options selected", () => {
      render(<CartComponent {...defaultProps} />);
      expect(
        screen.queryByText("Récapitulatif des options")
      ).not.toBeInTheDocument();
    });
  });

  describe("Order Submission", () => {
    it("submits order with correct data for rental", async () => {
      mockCreateOrderRequest.mockResolvedValueOnce({ id: 1 });

      render(<CartComponent {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Valider le panier/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockCreateOrderRequest).toHaveBeenCalledWith({
          folder_id: 1,
          vehicle_id: 2,
          options: [],
        });
      });
    });

    it("submits order with selected options", async () => {
      mockCreateOrderRequest.mockResolvedValueOnce({ id: 1 });

      render(<CartComponent {...defaultProps} />);
      const assuranceCheckbox = screen.getByRole("checkbox", {
        name: /Assurance/i,
      });
      const entretienCheckbox = screen.getByRole("checkbox", {
        name: /Entretien/i,
      });

      fireEvent.click(assuranceCheckbox);
      fireEvent.click(entretienCheckbox);

      const button = screen.getByRole("button", { name: /Valider le panier/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockCreateOrderRequest).toHaveBeenCalledWith({
          folder_id: 1,
          vehicle_id: 2,
          options: [{ option_id: 1 }, { option_id: 3 }],
        });
      });
    });

    it("calls order service on button click", async () => {
      mockCreateOrderRequest.mockResolvedValueOnce({ id: 1 });

      render(<CartComponent {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Valider le panier/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockCreateOrderRequest).toHaveBeenCalledWith({
          folder_id: 1,
          vehicle_id: 2,
          options: [],
        });
      });
    });

    it("disables button while loading", async () => {
      mockCreateOrderRequest.mockImplementationOnce(
        () => new Promise(() => {})
      );

      render(<CartComponent {...defaultProps} />);
      const button = screen.getByRole("button", {
        name: /Valider le panier/i,
      }) as HTMLButtonElement;

      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("disabled");
        expect(screen.getByText("En cours...")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("displays error message when order creation fails", async () => {
      const errorMessage = "Erreur lors de la création";
      mockCreateOrderRequest.mockRejectedValueOnce(new Error(errorMessage));

      render(<CartComponent {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Valider le panier/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("displays generic error for non-Error rejection", async () => {
      mockCreateOrderRequest.mockRejectedValueOnce("Unknown error");

      render(<CartComponent {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Valider le panier/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
      });
    });

    it("clears error when retrying", async () => {
      mockCreateOrderRequest.mockRejectedValueOnce(new Error("Error 1"));

      render(<CartComponent {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Valider le panier/i });

      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText("Error 1")).toBeInTheDocument();
      });

      mockCreateOrderRequest.mockResolvedValueOnce({ id: 1 });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.queryByText("Error 1")).not.toBeInTheDocument();
      });
    });
  });
});
