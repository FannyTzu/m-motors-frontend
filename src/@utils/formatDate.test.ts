import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("should format a valid date string to DD/MM/YYYY format", () => {
    const result = formatDate("2024-05-15");
    expect(result).toBe("15/05/2024");
  });

  it("should pad single digit days with zero", () => {
    const result = formatDate("2024-05-05");
    expect(result).toBe("05/05/2024");
  });

  it("should pad single digit months with zero", () => {
    const result = formatDate("2024-01-15");
    expect(result).toBe("15/01/2024");
  });

  it("should handle January (month 1)", () => {
    const result = formatDate("2024-01-01");
    expect(result).toBe("01/01/2024");
  });

  it("should handle December (month 12)", () => {
    const result = formatDate("2024-12-31");
    expect(result).toBe("31/12/2024");
  });

  it("should handle leap year dates", () => {
    const result = formatDate("2024-02-29");
    expect(result).toBe("29/02/2024");
  });

  it("should format date with ISO timestamp format", () => {
    const result = formatDate("2023-03-20T10:30:00.000Z");
    expect(result).toBe("20/03/2023");
  });

  it("should handle different years", () => {
    const result = formatDate("1999-07-22");
    expect(result).toBe("22/07/1999");
  });

  it("should handle recent dates", () => {
    const result = formatDate("2025-11-11");
    expect(result).toBe("11/11/2025");
  });
});
