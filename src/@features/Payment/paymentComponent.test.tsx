import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaymentComponent from "./paymentComponent";

jest.mock("./service/payment.service");
jest.mock("lucide-react", () => ({
  Lock: () => <div data-testid="lock-icon">Lock</div>,
}));

describe("PaymentComponent - Options Display", () => {
  const defaultProps = {
    orderId: 1,
    vehicleName: "Tesla Model 3",
    vehiclePrice: 45000,
    totalAmount: 47000,
    financeMode: "comptant" as const,
    onPaymentComplete: jest.fn(),
  };

  it("should display options section when options are provided", () => {
    const options = [
      { name: "Assurance", price: 1000 },
      { name: "Entretien", price: 500 },
    ];

    render(<PaymentComponent {...defaultProps} options={options} />);

    expect(screen.getByText("Options")).toBeInTheDocument();
  });

  it("should not display options section when options array is empty", () => {
    render(<PaymentComponent {...defaultProps} options={[]} />);

    const optionsHeadings = screen.queryAllByText("Options");
    expect(optionsHeadings.length).toBe(0);
  });

  it("should render each option with name and formatted price", () => {
    const options = [
      { name: "Assurance", price: 40 },
      { name: "Entretien", price: 35 },
      { name: "controle technique", price: 30 },
    ];

    render(<PaymentComponent {...defaultProps} options={options} />);

    options.forEach((option) => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
      expect(
        screen.getByText(`${Number(option.price).toFixed(2)}€`)
      ).toBeInTheDocument();
    });
  });

  it("should format option prices with 2 decimal places", () => {
    const options = [{ name: "Assurance", price: 1000.5 }];

    render(<PaymentComponent {...defaultProps} options={options} />);

    expect(screen.getByText("1000.50€")).toBeInTheDocument();
  });

  it("should handle single option", () => {
    const options = [{ name: "Premium Package", price: 3000 }];

    render(<PaymentComponent {...defaultProps} options={options} />);

    expect(screen.getByText("Premium Package")).toBeInTheDocument();
    expect(screen.getByText("3000.00€")).toBeInTheDocument();
  });

  it("should handle multiple options with different prices", () => {
    const options = [
      { name: "Option 1", price: 100 },
      { name: "Option 2", price: 200 },
      { name: "Option 3", price: 300 },
    ];

    render(<PaymentComponent {...defaultProps} options={options} />);

    const optionsList = screen.getByRole("list");
    const listItems = optionsList.querySelectorAll("li");

    expect(listItems).toHaveLength(3);
  });
});
