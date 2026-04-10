import { contactDetailsSchema, ContactDetailsForm } from "./formSchema";

describe("contactDetailsSchema", () => {
  describe("valid data", () => {
    it("validates a complete and correct form", () => {
      const validData = {
        lastName: "Moulineau",
        firstName: "Patsy",
        phone: "06 12 34 56 78",
        address: "11 Rue de la Fontaine, 33130 Bègles",
      };

      const result = contactDetailsSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("validates with different phone formats", () => {
      const phoneFormats = [
        "0612345678",
        "06 12 34 56 78",
        "+33 6 12 34 56 78",
        "+33612345678",
        "06.12.34.56.78",
        "06-12-34-56-78",
        "(06)12345678",
      ];

      phoneFormats.forEach((phone) => {
        const data = {
          lastName: "Test",
          firstName: "User",
          phone,
          address: "Test Address",
        };
        const result = contactDetailsSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("validates with minimal valid strings", () => {
      const data = {
        lastName: "A",
        firstName: "B",
        phone: "12345678",
        address: "C",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("validates with 20 character phone", () => {
      const data = {
        lastName: "Test",
        firstName: "User",
        phone: "12345678901234567890",
        address: "Address",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("lastName validation", () => {
    it("rejects empty lastName", () => {
      const data = {
        lastName: "",
        firstName: "Patsy",
        phone: "06 12 34 56 78",
        address: "11 Rue de la Fontaine",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Le nom est requis");
      }
    });

    it("accepts non-empty lastName", () => {
      const data = {
        lastName: "Moulineau",
        firstName: "Patsy",
        phone: "06 12 34 56 78",
        address: "Address",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("firstName validation", () => {
    it("rejects empty firstName", () => {
      const data = {
        lastName: "Moulineau",
        firstName: "",
        phone: "06 12 34 56 78",
        address: "11 Rue de la Fontaine",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Le prénom est requis");
      }
    });

    it("accepts non-empty firstName", () => {
      const data = {
        lastName: "Moulineau",
        firstName: "Patsy",
        phone: "06 12 34 56 78",
        address: "Address",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("phone validation", () => {
    it("rejects phone shorter than 8 characters", () => {
      const data = {
        lastName: "Moulineau",
        firstName: "Patsy",
        phone: "1234567",
        address: "Address",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Le numéro est trop court");
      }
    });

    it("rejects phone longer than 20 characters", () => {
      const data = {
        lastName: "Moulineau",
        firstName: "Patsy",
        phone: "123456789012345678901",
        address: "Address",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Le numéro est trop long");
      }
    });

    it("rejects phone with invalid characters", () => {
      const invalidPhones = [
        "06 12 34 56 78 ABC",
        "06@12#34$56%78",
        "06-12-34-56-78!",
      ];

      invalidPhones.forEach((phone) => {
        const data = {
          lastName: "Moulineau",
          firstName: "Patsy",
          phone,
          address: "Address",
        };

        const result = contactDetailsSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("Numéro invalide");
        }
      });
    });

    it("accepts valid phone with 8 characters", () => {
      const data = {
        lastName: "Moulineau",
        firstName: "Patsy",
        phone: "12345678",
        address: "Address",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("address validation", () => {
    it("rejects empty address", () => {
      const data = {
        lastName: "Moulineau",
        firstName: "Patsy",
        phone: "06 12 34 56 78",
        address: "",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("L'adresse est requise");
      }
    });

    it("accepts non-empty address", () => {
      const data = {
        lastName: "Moulineau",
        firstName: "Patsy",
        phone: "06 12 34 56 78",
        address: "11 Rue de la Fontaine, 33130 Bègles",
      };

      const result = contactDetailsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("type inference", () => {
    it("infers correct type from schema", () => {
      const validData: ContactDetailsForm = {
        lastName: "Moulineau",
        firstName: "Patsy",
        phone: "06 12 34 56 78",
        address: "Address",
      };

      expect(validData).toHaveProperty("lastName");
      expect(validData).toHaveProperty("firstName");
      expect(validData).toHaveProperty("phone");
      expect(validData).toHaveProperty("address");
    });
  });
});
