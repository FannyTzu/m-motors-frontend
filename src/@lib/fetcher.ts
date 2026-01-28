export const fetcher = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  return response.json();
};
