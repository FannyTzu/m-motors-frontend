export const createVehicles = async (vehicleData: {
  brand: string;
  model: string;
  transmission: "manual" | "automatic";
  year: number;
  energy: string;
  kms: number;
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
