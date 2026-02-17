"use client";

import React, { useEffect, useState } from "react";
import { contactDetailsSchema, ContactDetailsForm } from "./formSchema";
import s from "./styles.module.css";
import { useAuthContext } from "@/@features/Auth/context/AuthContext";
import { getMeRequest } from "@/@features/Auth/service/auth.service";
import { useRouter } from "next/navigation";
import ArrowBack from "@/@Component/ArrowBack/ArrowBack";

function ContactDetailsComponent() {
  const { user, updateUser, isLoading } = useAuthContext();
  const [formData, setFormData] = useState<ContactDetailsForm>({
    lastName: "",
    firstName: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ContactDetailsForm, string>>
  >({});
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({
        lastName: user.lastName || "",
        firstName: user.firstName || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    if (!user && !isLoading) {
      (async () => {
        try {
          const me = await getMeRequest();
          setFormData({
            lastName: me.lastName || "",
            firstName: me.firstName || "",
            phone: me.phone || "",
            address: me.address || "",
          });
        } catch {}
      })();
    }
  }, [user, isLoading]);

  const isReady = !isLoading && !!user;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const result = contactDetailsSchema.safeParse({
      ...formData,
      [name]: value,
    });
    if (!result.success) {
      const fieldError = result.error.issues.find(
        (issue) => issue.path[0] === name
      )?.message;
      setFormErrors((prev) => ({ ...prev, [name]: fieldError }));
    } else {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactDetailsSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactDetailsForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ContactDetailsForm;
        fieldErrors[key] = issue.message;
      });
      setFormErrors(fieldErrors);
      return;
    }
    setIsFormSubmitting(true);
    try {
      await updateUser(formData);
      router.replace("/user-space");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la modification du contact"
      );
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div>
      <ArrowBack />
      <div className={s.title}>
        <h2>Modifier mes informations personnelles</h2>
      </div>
      {error && <div className={s.error}>{error}</div>}
      {!isReady && <div className={s.loading}>Chargement des données...</div>}
      <form onSubmit={handleSubmit} className={s.form}>
        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label htmlFor="lastName" className={s.label}>
              Nom
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={s.input}
              placeholder="Moulineau"
              aria-invalid={!!formErrors.lastName}
              aria-describedby="lastName-error"
              disabled={!isReady}
            />
            {formErrors.lastName && (
              <span className={s.error} id="lastName-error">
                {formErrors.lastName}
              </span>
            )}
          </div>
          <div className={s.formGroup}>
            <label htmlFor="firstName" className={s.label}>
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={s.input}
              placeholder="Patsy"
              aria-invalid={!!formErrors.firstName}
              aria-describedby="firstName-error"
              disabled={!isReady}
            />
            {formErrors.firstName && (
              <span className={s.error} id="firstName-error">
                {formErrors.firstName}
              </span>
            )}
          </div>
          <div className={s.formGroup}>
            <label htmlFor="phone" className={s.label}>
              Numéro de téléphone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={s.input}
              placeholder="06 12 34 56 78"
              aria-invalid={!!formErrors.phone}
              aria-describedby="phone-error"
              disabled={!isReady}
            />
            {formErrors.phone && (
              <span className={s.error} id="phone-error">
                {formErrors.phone}
              </span>
            )}
          </div>
          <div className={s.formGroup}>
            <label htmlFor="address" className={s.label}>
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={s.input}
              placeholder="11 Rue de la Fontaine, 33130 Bègles"
              aria-invalid={!!formErrors.address}
              aria-describedby="address-error"
              disabled={!isReady}
            />
            {formErrors.address && (
              <span className={s.error} id="address-error">
                {formErrors.address}
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={s.submitButton}
          disabled={
            isFormSubmitting ||
            !isReady ||
            Object.values(formErrors).some(Boolean)
          }
        >
          {isFormSubmitting ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}

export default ContactDetailsComponent;
