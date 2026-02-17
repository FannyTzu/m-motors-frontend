import { z } from "zod";

export const contactDetailsSchema = z.object({
  lastName: z.string().min(1, "Le nom est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  phone: z
    .string()
    .min(8, "Le numéro est trop court")
    .max(20, "Le numéro est trop long")
    .regex(/^[0-9 +().-]*$/, "Numéro invalide"),
  address: z.string().min(1, "L'adresse est requise"),
});

export type ContactDetailsForm = z.infer<typeof contactDetailsSchema>;
