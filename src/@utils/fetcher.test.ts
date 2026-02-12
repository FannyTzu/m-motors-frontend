import { fetcher } from "./fetcher";

global.fetch = jest.fn();
const mockFetch = fetch as jest.Mock;

it("retourne les données si la requête réussit", async () => {
  const fakeData = { id: 1, name: "test" };

  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => fakeData,
  });

  const result = await fetcher("/fake-url");

  expect(result).toEqual(fakeData);
  expect(fetch).toHaveBeenCalledWith("/fake-url", undefined);
});

it("erreur si la requête échoue", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
  });

  await expect(fetcher("/fake-url")).rejects.toThrow(
    "An error occurred while fetching the data."
  );
});

it("passe correctement les options à fetch", async () => {
  const options = { method: "POST", body: JSON.stringify({ test: 123 }) };
  mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

  await fetcher("/fake-url", options);

  expect(fetch).toHaveBeenCalledWith("/fake-url", options);
});
