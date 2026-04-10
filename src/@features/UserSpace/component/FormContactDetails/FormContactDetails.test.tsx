import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormContactDetailsComponent from "./FormContactDetails";
import { useAuthContext } from "@/@features/Auth/context/AuthContext";
import { getMeRequest } from "@/@features/Auth/service/auth.service";
import { useRouter } from "next/navigation";

jest.mock("@/@features/Auth/context/AuthContext");
jest.mock("@/@features/Auth/service/auth.service");
jest.mock("next/navigation");
jest.mock("@/@Component/ArrowBack/ArrowBack", () => {
  return function MockArrowBack() {
    return <div data-testid="arrow-back">Arrow Back</div>;
  };
});

const mockUseAuthContext = useAuthContext as jest.Mock;
const mockGetMeRequest = getMeRequest as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe("FormContactDetailsComponent", () => {
  let mockReplace: jest.Mock;
  let mockUpdateUser: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReplace = jest.fn();
    mockUpdateUser = jest.fn();

    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    });

    mockUseAuthContext.mockReturnValue({
      user: {
        id: 1,
        mail: "test@example.com",
        role: "user",
        lastName: "Moulineau",
        firstName: "Patsy",
        phone: "06 12 34 56 78",
        address: "11 Rue de la Fontaine, 33130 Bègles",
      },
      updateUser: mockUpdateUser,
      isLoading: false,
    });
  });

  it("renders the form with title", () => {
    render(<FormContactDetailsComponent />);
    expect(
      screen.getByText("Modifier mes informations personnelles")
    ).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<FormContactDetailsComponent />);
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
    expect(screen.getByLabelText("Numéro de téléphone")).toBeInTheDocument();
    expect(screen.getByLabelText("Adresse")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<FormContactDetailsComponent />);
    expect(
      screen.getByRole("button", { name: /Enregistrer/i })
    ).toBeInTheDocument();
  });

  it("populates form fields with user data", () => {
    render(<FormContactDetailsComponent />);
    expect(screen.getByDisplayValue("Moulineau")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Patsy")).toBeInTheDocument();
    expect(screen.getByDisplayValue("06 12 34 56 78")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("11 Rue de la Fontaine, 33130 Bègles")
    ).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(<FormContactDetailsComponent />);
    const firstNameInput = screen.getByLabelText("Prénom") as HTMLInputElement;

    fireEvent.change(firstNameInput, { target: { value: "Jean" } });
    expect(firstNameInput.value).toBe("Jean");
  });

  it("shows validation error for empty lastName", async () => {
    render(<FormContactDetailsComponent />);
    const lastNameInput = screen.getByLabelText("Nom") as HTMLInputElement;

    fireEvent.change(lastNameInput, { target: { value: "" } });
    await waitFor(() => {
      expect(screen.getByText("Le nom est requis")).toBeInTheDocument();
    });
  });

  it("shows validation error for empty firstName", async () => {
    render(<FormContactDetailsComponent />);
    const firstNameInput = screen.getByLabelText("Prénom") as HTMLInputElement;

    fireEvent.change(firstNameInput, { target: { value: "" } });
    await waitFor(() => {
      expect(screen.getByText("Le prénom est requis")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid phone", async () => {
    render(<FormContactDetailsComponent />);
    const phoneInput = screen.getByLabelText(
      "Numéro de téléphone"
    ) as HTMLInputElement;

    fireEvent.change(phoneInput, { target: { value: "123" } });
    await waitFor(() => {
      expect(screen.getByText("Le numéro est trop court")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid phone characters", async () => {
    render(<FormContactDetailsComponent />);
    const phoneInput = screen.getByLabelText(
      "Numéro de téléphone"
    ) as HTMLInputElement;

    fireEvent.change(phoneInput, { target: { value: "06 12 34 56 78 ABC" } });
    await waitFor(() => {
      expect(screen.getByText("Numéro invalide")).toBeInTheDocument();
    });
  });

  it("shows validation error for empty address", async () => {
    render(<FormContactDetailsComponent />);
    const addressInput = screen.getByLabelText("Adresse") as HTMLInputElement;

    fireEvent.change(addressInput, { target: { value: "" } });
    await waitFor(() => {
      expect(screen.getByText("L'adresse est requise")).toBeInTheDocument();
    });
  });

  it("disables submit button when there are validation errors", async () => {
    render(<FormContactDetailsComponent />);
    const lastNameInput = screen.getByLabelText("Nom");
    const submitButton = screen.getByRole("button", { name: /Enregistrer/i });

    fireEvent.change(lastNameInput, { target: { value: "" } });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it("submits form with valid data", async () => {
    mockUpdateUser.mockResolvedValue({
      id: 1,
      mail: "test@example.com",
      role: "user",
      lastName: "Moulineau",
      firstName: "Jean",
      phone: "06 12 34 56 78",
      address: "11 Rue de la Fontaine, 33130 Bègles",
    });

    render(<FormContactDetailsComponent />);
    const firstNameInput = screen.getByLabelText("Prénom");
    const submitButton = screen.getByRole("button", { name: /Enregistrer/i });

    fireEvent.change(firstNameInput, { target: { value: "Jean" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        lastName: "Moulineau",
        firstName: "Jean",
        phone: "06 12 34 56 78",
        address: "11 Rue de la Fontaine, 33130 Bègles",
      });
    });
  });

  it("redirects to /user-space after successful form submission", async () => {
    mockUpdateUser.mockResolvedValue({
      id: 1,
      mail: "test@example.com",
      role: "user",
    });

    render(<FormContactDetailsComponent />);
    const submitButton = screen.getByRole("button", { name: /Enregistrer/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/user-space");
    });
  });

  it("shows error message on submission failure", async () => {
    mockUpdateUser.mockRejectedValue(new Error("Network error"));

    render(<FormContactDetailsComponent />);
    const submitButton = screen.getByRole("button", { name: /Enregistrer/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("shows default error message when error has no message", async () => {
    mockUpdateUser.mockRejectedValue(new Error());

    render(<FormContactDetailsComponent />);
    const submitButton = screen.getByRole("button", { name: /Enregistrer/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Erreur lors de la modification du contact")
      ).toBeInTheDocument();
    });
  });

  it("shows multiple validation errors at once", async () => {
    render(<FormContactDetailsComponent />);
    const lastNameInput = screen.getByLabelText("Nom");
    const phoneInput = screen.getByLabelText("Numéro de téléphone");

    fireEvent.change(lastNameInput, { target: { value: "" } });
    fireEvent.change(phoneInput, { target: { value: "123" } });

    await waitFor(() => {
      expect(screen.getByText("Le nom est requis")).toBeInTheDocument();
      expect(screen.getByText("Le numéro est trop court")).toBeInTheDocument();
    });
  });

  it("clears error when field becomes valid", async () => {
    render(<FormContactDetailsComponent />);
    const lastNameInput = screen.getByLabelText("Nom");

    fireEvent.change(lastNameInput, { target: { value: "" } });
    await waitFor(() => {
      expect(screen.getByText("Le nom est requis")).toBeInTheDocument();
    });

    fireEvent.change(lastNameInput, { target: { value: "Dupont" } });
    await waitFor(() => {
      expect(screen.queryByText("Le nom est requis")).not.toBeInTheDocument();
    });
  });

  it("shows loading message when component is not ready", () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      updateUser: mockUpdateUser,
      isLoading: true,
    });

    render(<FormContactDetailsComponent />);
    expect(screen.getByText("Chargement des données...")).toBeInTheDocument();
  });

  it("disables form inputs when loading", () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      updateUser: mockUpdateUser,
      isLoading: true,
    });

    render(<FormContactDetailsComponent />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("changes submit button text while submitting", async () => {
    mockUpdateUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({}), 100);
        })
    );

    render(<FormContactDetailsComponent />);
    const submitButton = screen.getByRole("button", { name: /Enregistrer/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Enregistrement...")).toBeInTheDocument();
    });
  });

  it("fetches user data if not in context", async () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      updateUser: mockUpdateUser,
      isLoading: false,
    });

    mockGetMeRequest.mockResolvedValue({
      id: 1,
      mail: "test@example.com",
      role: "user",
      lastName: "Moulineau",
      firstName: "Patsy",
      phone: "06 12 34 56 78",
      address: "11 Rue de la Fontaine, 33130 Bègles",
    });

    render(<FormContactDetailsComponent />);

    await waitFor(() => {
      expect(mockGetMeRequest).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Moulineau")).toBeInTheDocument();
    });
  });

  it("has correct aria attributes for validation", async () => {
    render(<FormContactDetailsComponent />);
    const lastNameInput = screen.getByLabelText("Nom");

    fireEvent.change(lastNameInput, { target: { value: "" } });
    await waitFor(() => {
      expect(lastNameInput).toHaveAttribute("aria-invalid", "true");
    });

    fireEvent.change(lastNameInput, { target: { value: "Dupont" } });
    await waitFor(() => {
      expect(lastNameInput).toHaveAttribute("aria-invalid", "false");
    });
  });
});
