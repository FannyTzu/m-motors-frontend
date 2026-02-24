import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserSpaceComponent from "./UserSpaceComponent";
import { useAuth } from "@/@features/Auth/hook/useAuth";

jest.mock("@/@features/Auth/hook/useAuth");
jest.mock("@/@features/Auth/service/auth.service");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));
import type { FC } from "react";

type ModalMockProps = {
  onConfirm: () => void;
};

jest.mock("@/@Component/Modal/Modal", () => ({
  __esModule: true,
  default: (({ onConfirm }: ModalMockProps) => (
    <button onClick={onConfirm}>Supprimer</button>
  )) as FC<ModalMockProps>,
}));

const mockUser = {
  id: 1,
  mail: "test@mail.com",
  role: "user",
  firstName: "John",
  lastName: "Doe",
  phone: "0123456789",
  address: "1 rue de Paris",
};

describe("UserSpaceComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it("affiche le loader si isLoading", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, isLoading: true });
    render(<UserSpaceComponent />);
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it("affiche les infos utilisateur", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
    });
    render(<UserSpaceComponent />);
    expect(screen.getByText(/mon espace personnel/i)).toBeInTheDocument();
    expect(screen.getByText(/john/i)).toBeInTheDocument();
    expect(screen.getByText(/doe/i)).toBeInTheDocument();
    expect(screen.getByText(/test@mail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/0123456789/i)).toBeInTheDocument();
    expect(screen.getByText(/1 rue de paris/i)).toBeInTheDocument();
  });

  it("ouvre la modale de suppression", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
    });
    render(<UserSpaceComponent />);
    const deleteBtn = screen.getByText(/supprimer mon compte/i);
    fireEvent.click(deleteBtn);
    expect(await screen.findByText("Supprimer")).toBeInTheDocument();
  });
});
