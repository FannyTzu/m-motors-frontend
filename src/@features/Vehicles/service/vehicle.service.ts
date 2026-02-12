import { catchAsync } from "@/@utils/catchAsync";

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
  return catchAsync(
    async () => {
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
        throw new Error(err.message || "Impossible de créer le véhicule");
      }

      return await response.json();
    },
    {
      tags: { service: "vehicle", action: "create" },
      extra: { brand: vehicleData.brand, model: vehicleData.model },
    }
  );
};

export const getVehicles = async () => {
  return catchAsync(
    async () => {
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
        throw new Error(err.message || "Impossible de récupérer les véhicules");
      }

      return await response.json();
    },
    {
      tags: { service: "vehicle", action: "getAll" },
    }
  );
};

export const getVehicleById = async (id: number) => {
  return catchAsync(
    async () => {
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
        throw new Error(err.message || "Impossible de récupérer les véhicules");
      }

      return await response.json();
    },
    {
      tags: { service: "vehicle", action: "getById" },
      extra: { id },
    }
  );
};

export const getVehiclesByType = async (type: "sale" | "rental") => {
  return catchAsync(
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vehicle/type/${type}`,
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
        throw new Error(
          err.message || "Impossible d'afficher le véhicule par type"
        );
      }

      return await response.json();
    },
    {
      tags: { service: "vehicle", action: "getByType" },
      extra: { type },
    }
  );
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
  return catchAsync(
    async () => {
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
        throw new Error(err.message || "Mise à jour impossible");
      }

      return await response.json();
    },
    {
      tags: { service: "vehicle", action: "update" },
      extra: { id, brand: vehicleData.brand, model: vehicleData.model },
    }
  );
};

export const deleteVehicleById = async (id: number) => {
  return catchAsync(
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vehicle/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Suppression impossible");
      }
    },
    {
      tags: { service: "vehicle", action: "delete" },
      extra: { id },
    }
  );
};
