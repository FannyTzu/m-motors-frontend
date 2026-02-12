import { render, screen, fireEvent } from "@testing-library/react";
import AuthComponent from "./AuthComponent";

jest.mock("lucide-react", () => ({
  TriangleAlert: () => <div>TriangleAlert</div>,
  CheckCircle: () => <div>CheckCircle</div>,
}));

describe("AuthComponent", () => {
  it("renders correctly for login", () => {
    render(<AuthComponent type="login" />);

    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.getByText("Accédez à votre espace")).toBeInTheDocument();
    expect(screen.getByText("SE CONNECTER")).toBeInTheDocument();
    expect(screen.getByText("Pas encore de compte ?")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
  });

  it("renders correctly for register", () => {
    render(<AuthComponent type="register" />);

    expect(screen.getByText("Créer un compte")).toBeInTheDocument();
    expect(
      screen.getByText("Et trouver votre prochain véhicule !")
    ).toBeInTheDocument();
    expect(screen.getByText("S'INSCRIRE")).toBeInTheDocument();
    expect(screen.getByText("Déjà un compte ?")).toBeInTheDocument();
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });

  it("updates inputs and calls onSubmit", () => {
    const handleSubmit = jest.fn();
    render(<AuthComponent type="login" onSubmit={handleSubmit} />);

    const emailInput = screen.getByPlaceholderText("exemple@gmail.com");
    const passwordInput = screen.getByPlaceholderText("*******");
    const button = screen.getByText("SE CONNECTER");

    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(button);

    expect(handleSubmit).toHaveBeenCalledWith("test@mail.com", "password123");
  });

  it("displays error and success messages", () => {
    render(
      <AuthComponent
        type="login"
        error="Erreur de connexion"
        success="Connecté"
      />
    );

    expect(screen.getByText("Erreur de connexion")).toBeInTheDocument();
    expect(screen.getByText("Connecté")).toBeInTheDocument();
    expect(screen.getByText("TriangleAlert")).toBeInTheDocument();
    expect(screen.getByText("CheckCircle")).toBeInTheDocument();
  });

  it("calls redirectionUrl on click", () => {
    const redirect = jest.fn();
    render(<AuthComponent type="login" redirectionUrl={redirect} />);

    fireEvent.click(screen.getByText("S'inscrire"));
    expect(redirect).toHaveBeenCalled();
  });
});
