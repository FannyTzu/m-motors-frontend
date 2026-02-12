import { render, screen, waitFor } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { useRouter } from "next/navigation";
import { useAuth } from "@/@features/Auth/hook/useAuth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/@features/Auth/hook/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockReplace = jest.fn();

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it("affiche le loader pendant le chargement", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(
      <ProtectedRoute allowedRoles={["admin"]}>
        <div>Contenu protege</div>
      </ProtectedRoute>
    );

    expect(screen.getByText(/Chargement/)).toBeInTheDocument();
    expect(screen.queryByText("Contenu protege")).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirige vers /login si non authentifie", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <ProtectedRoute allowedRoles={["admin"]}>
        <div>Contenu protege</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });

    expect(screen.queryByText("Contenu protege")).not.toBeInTheDocument();
  });

  it("redirige vers /login si role non autorise", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, mail: "test@example.com", role: "user" },
      isLoading: false,
    });

    render(
      <ProtectedRoute allowedRoles={["admin"]}>
        <div>Contenu protege</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });

    expect(screen.queryByText("Contenu protege")).not.toBeInTheDocument();
  });

  it("affiche le contenu si role autorise", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, mail: "test@example.com", role: "admin" },
      isLoading: false,
    });

    render(
      <ProtectedRoute allowedRoles={["admin"]}>
        <div>Contenu protege</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Contenu protege")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
