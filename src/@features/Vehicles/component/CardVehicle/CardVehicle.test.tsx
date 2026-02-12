import { render, screen, fireEvent } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import CardVehicle from "./CardVehicle";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

type NextImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: NextImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

jest.mock("lucide-react", () => ({
  ArrowBigRight: () => <div data-testid="arrow-icon">Arrow</div>,
  CalendarDays: () => <div data-testid="calendar-icon">Calendar</div>,
  Fuel: () => <div data-testid="fuel-icon">Fuel</div>,
  Gauge: () => <div data-testid="gauge-icon">Gauge</div>,
}));

const mockPush = jest.fn();

describe("CardVehicle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const defaultProps = {
    id: 1,
    image: "/car.jpg",
    type: "sale",
    brand: "Opria",
    model: "S2",
    year: 2023,
    km: 5000,
    energy: "Essence",
    price: 35000,
  };
  it(" display correctly all data vehicles", () => {
    render(<CardVehicle {...defaultProps} />);
    expect(screen.getByAltText("Opria S2")).toBeInTheDocument();
    expect(screen.getByText("Opria S2")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("5000 km")).toBeInTheDocument();
    expect(screen.getByText("Essence")).toBeInTheDocument();
    expect(screen.getByText("35 000 €")).toBeInTheDocument();
  });

  it("display 'Vente' for type 'sale'", () => {
    render(<CardVehicle {...defaultProps} type="sale" />);

    expect(screen.getByText("Vente")).toBeInTheDocument();
  });

  it("display 'Location LLD' for type 'rental'", () => {
    render(<CardVehicle {...defaultProps} type="rental" />);

    expect(screen.getByText("Location LLD")).toBeInTheDocument();
  });
  it("display ' / mois' for rental vehicles", () => {
    render(<CardVehicle {...defaultProps} type="rental" price={500} />);
    expect(screen.getByText("500 €")).toBeInTheDocument();
    expect(screen.getByText("/ mois")).toBeInTheDocument();
  });
  it("don't display ' / mois' for sale vehicles", () => {
    render(<CardVehicle {...defaultProps} type="sale" />);
    expect(screen.queryByText("/ mois")).not.toBeInTheDocument();
  });
  it("display image with good src and alt", () => {
    render(<CardVehicle {...defaultProps} />);

    const image = screen.getByAltText("Opria S2");
    expect(image).toHaveAttribute("src", "/car.jpg");
  });

  it("display all icons", () => {
    render(<CardVehicle {...defaultProps} />);

    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
    expect(screen.getByTestId("gauge-icon")).toBeInTheDocument();
    expect(screen.getByTestId("fuel-icon")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-icon")).toBeInTheDocument();
  });

  it("display label 'À partir de'", () => {
    render(<CardVehicle {...defaultProps} />);

    expect(screen.getByText("À partir de")).toBeInTheDocument();
  });
  it("display text 'En savoir plus'", () => {
    render(<CardVehicle {...defaultProps} />);
    expect(screen.getByText("En savoir plus")).toBeInTheDocument();
  });
  it("price 0", () => {
    render(<CardVehicle {...defaultProps} price={0} />);

    expect(screen.getByText("0 €")).toBeInTheDocument();
  });
  it("high km", () => {
    render(<CardVehicle {...defaultProps} km={150000} />);
    expect(screen.getByText("150000 km")).toBeInTheDocument();
  });
  it("navigate with good ID for different vehicles", () => {
    const { rerender } = render(<CardVehicle {...defaultProps} id={42} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith("/detailed-view/42");

    mockPush.mockClear();

    rerender(<CardVehicle {...defaultProps} id={99} />);
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith("/detailed-view/99");
  });
});
