export const createVehicles = async (vehicleData: {
  brand: string;
  model: string;
  transmission: "manual" | "automatic";
  year: number;
  energy: string;
  km: number;
  color: string;
  place: number;
  door: number;
  type: "sale" | "rental";
  price: number;
  image?: string;
  status: "available" | "reserved" | "sold";
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicle/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(vehicleData),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to create vehicle");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating vehicle:", error);
    throw error;
  }
};

export const getVehicles = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicle/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch vehicles");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};

export const getVehicleById = async (id: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicle/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch vehicle");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    throw error;
  }
};

export const updateVehicle = async (
  id: number,
  vehicleData: {
    brand: string;
    model: string;
    transmission: "manual" | "automatic";
    year: number;
    energy: string;
    km: number;
    color: string;
    place: number;
    door: number;
    type: "sale" | "rental";
    price: number;
    image?: string;
    description?: string;
    status: "available" | "reserved" | "sold";
  }
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicle/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(vehicleData),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to update vehicle");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
};
