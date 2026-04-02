import { catchAsync } from "@/@utils/catchAsync";

interface ApiOption {
  id: number;
  name: string;
  price: string | number;
}

interface Option {
  id: string;
  label: string;
  price: number;
}

export const fetchOptionsRequest = async (): Promise<Option[]> => {
  return catchAsync(
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/options`,
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
        throw new Error(err.message || "Impossible de récupérer les options");
      }

      const data = await response.json();

      const optionsArray = Array.isArray(data) ? data : data.options || [];

      return optionsArray.map((o: ApiOption) => ({
        id: String(o.id),
        label: o.name,
        price: parseFloat(String(o.price)),
      }));
    },
    {
      tags: { service: "option", action: "fetchAll" },
    }
  );
};
