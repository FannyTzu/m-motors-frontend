import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import { useAuth } from "@/@features/Auth/hook/useAuth";
import { useRouter } from "next/navigation";

jest.mock("@/@features/Auth/hook/useAuth");
jest.mock("next/navigation");

const mockUseAuth = useAuth as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe("Navbar - Redirections", () => {
  let mockReplace: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReplace = jest.fn();

    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    });

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
      user: {
        id: 1,
        mail: "user@example.com",
        role: "user",
      },
    });
  });

  it("redirects to /sale when sale button is clicked", () => {
    render(<Navbar />);
    const saleButton = screen.getByRole("button", { name: /Vente/i });

    fireEvent.click(saleButton);

    expect(mockReplace).toHaveBeenCalledWith("/sale");
  });

  it("redirects to /rental when rental button is clicked", () => {
    render(<Navbar />);
    const rentalButton = screen.getByRole("button", { name: /Location/i });

    fireEvent.click(rentalButton);

    expect(mockReplace).toHaveBeenCalledWith("/rental");
  });

  it("redirects to /user-space when user space button is clicked", () => {
    render(<Navbar />);
    const userButton = screen.getByRole("button", { name: /Mon espace/i });

    fireEvent.click(userButton);

    expect(mockReplace).toHaveBeenCalledWith("/user-space");
  });

  it("redirects to / when logo is clicked", () => {
    render(<Navbar />);
    const logo = screen.getByText("M-Motors");

    fireEvent.click(logo);

    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});
