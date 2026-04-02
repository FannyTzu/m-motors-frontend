import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartComponent from "./CartComponent";
import * as orderService from "../../service/order.service";
import * as optionService from "../../service/option.service";

jest.mock("../../service/order.service");
jest.mock("../../service/option.service");

const mockCreateOrderRequest = orderService.createOrderRequest as jest.Mock;
const mockFetchOptionsRequest = optionService.fetchOptionsRequest as jest.Mock;

const mockOptions = [
  { id: "1", label: "Assurance", price: 50 },
  { id: "2", label: "Contrôle technique", price: 5 },
  { id: "3", label: "Entretien", price: 30 },
  { id: "4", label: "Assistance dépannage", price: 15 },
];

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
    mockFetchOptionsRequest.mockResolvedValue(mockOptions);
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

    it("does not show options section for sale type", () => {
      render(<CartComponent {...{ ...defaultProps, type: "sale" }} />);
      expect(screen.queryByText("Options disponibles")).not.toBeInTheDocument();
    });

    it("renders validate button", () => {
      render(<CartComponent {...defaultProps} />);
      const button = screen.getByRole("button", { name: /Valider le panier/i });
      expect(button).toBeInTheDocument();
    });

    it("shows loading state for options", () => {
      mockFetchOptionsRequest.mockImplementationOnce(
        () => new Promise(() => {})
      );
      render(<CartComponent {...defaultProps} />);
      expect(screen.getByText("Chargement des options...")).toBeInTheDocument();
    });

    it("displays options after loading for rental", async () => {
      render(<CartComponent {...defaultProps} />);
      await waitFor(() => {
        mockOptions.forEach((option) => {
          expect(screen.getByText(option.label)).toBeInTheDocument();
        });
      });
    });
  });

  describe("Option Selection", () => {
    it("toggles option selection on checkbox click", async () => {
      render(<CartComponent {...defaultProps} />);

      const assuranceCheckbox = await screen.findByRole("checkbox", {
        name: /Assurance/i,
      });

      expect((assuranceCheckbox as HTMLInputElement).checked).toBe(false);
      fireEvent.click(assuranceCheckbox);
      expect((assuranceCheckbox as HTMLInputElement).checked).toBe(true);
    });

    it("shows selected options summary", async () => {
      render(<CartComponent {...defaultProps} />);

      const assuranceCheckbox = await screen.findByRole("checkbox", {
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
      await waitFor(() => expect(button).not.toBeDisabled());

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

      const assuranceCheckbox = await screen.findByRole("checkbox", {
        name: /Assurance/i,
      });
      const entretienCheckbox = screen.getByRole("checkbox", {
        name: /Entretien/i,
      });

      fireEvent.click(assuranceCheckbox);
      fireEvent.click(entretienCheckbox);

      const button = screen.getByRole("button", {
        name: /Valider le panier/i,
      });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockCreateOrderRequest).toHaveBeenCalledWith({
          folder_id: 1,
          vehicle_id: 2,
          options: [{ option_id: 1 }, { option_id: 3 }],
        });
      });
    });

    it("disables button while loading", async () => {
      mockCreateOrderRequest.mockImplementationOnce(
        () => new Promise(() => {})
      );

      render(<CartComponent {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Valider le panier/i });
      await waitFor(() => expect(button).not.toBeDisabled());

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
      await waitFor(() => expect(button).not.toBeDisabled());

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("displays generic error for non-Error rejection", async () => {
      mockCreateOrderRequest.mockRejectedValueOnce("Unknown error");

      render(<CartComponent {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Valider le panier/i });
      await waitFor(() => expect(button).not.toBeDisabled());

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
      });
    });

    it("displays option loading error", async () => {
      const errorMessage = "Erreur lors du chargement des options";
      mockFetchOptionsRequest.mockRejectedValueOnce(new Error(errorMessage));

      render(<CartComponent {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });
});
