import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal", () => {
  const mockOnConfirm = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the modal with title and description", () => {
    render(
      <Modal
        title="Confirm Action"
        description="Etes vous sûr de vouloir continuer?"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Etes vous sûr de vouloir continuer?")
    ).toBeInTheDocument();
  });

  it("should render with default button text", () => {
    render(
      <Modal
        title="Test"
        description="Test description"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Confirmer")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
  });

  it("should render with custom button text", () => {
    render(
      <Modal
        title="Test"
        description="Test description"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
        confirmText="Accept"
        cancelText="Reject"
      />
    );

    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    render(
      <Modal
        title="Test"
        description="Test description"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen
      .getByRole("button", { name: "" })
      .closest("button");
    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when cancel button is clicked", () => {
    render(
      <Modal
        title="Test"
        description="Test description"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByText("Annuler");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("should call both onConfirm and onClose when confirm button is clicked", () => {
    render(
      <Modal
        title="Test"
        description="Test description"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const confirmButton = screen.getByText("Confirmer");
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should close modal when clicking on the overlay", () => {
    const { container } = render(
      <Modal
        title="Test"
        description="Test description"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const overlay = container.querySelector("[class*='overlay']");
    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should not close modal when clicking inside the modal content", () => {
    const { container } = render(
      <Modal
        title="Test"
        description="Test description"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const modal = container.querySelector("[class*='modal']");
    if (modal) {
      fireEvent.click(modal);
    }

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should render with custom confirmText and cancelText", () => {
    render(
      <Modal
        title="Delete Item?"
        description="Cette action est irréversible."
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    );

    const deleteButton = screen.getByText("Supprimer");

    fireEvent.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
