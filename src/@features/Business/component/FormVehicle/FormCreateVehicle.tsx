"use client";
import React from "react";
import s from "./styles.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVehicles } from "@/@features/Vehicles/service/vehicle.service";
import { CircleX } from "lucide-react";

interface FormCreateVehicleProps {
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

function FormCreateVehicle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormCreateVehicleProps>({
    brand: "",
    model: "",
    transmission: "automatic",
    year: new Date().getFullYear(),
    energy: "",
    km: 0,
    color: "",
    place: 5,
    door: 4,
    type: "sale",
    price: 0,
    image: "",
    status: "available",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setError(null);
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" ||
        name === "km" ||
        name === "place" ||
        name === "door" ||
        name === "price"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await createVehicles(formData);
      console.log("Véhicule créé:", response);
      router.push("/business-space");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création du véhicule"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className={s.container}>
      <form onSubmit={handleSubmit} className={s.form}>
        <h2 className={s.formTitle}>Ajouter un véhicule</h2>
        {error && (
          <div className={s.errorMessage}>
            <CircleX /> {error}
          </div>
        )}

        <div className={s.formGrid}>
          <div className={s.formGroup}>
            <label htmlFor="brand" className={s.label}>
              Marque *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={s.input}
              placeholder="Ex: Opria"
              required
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="model" className={s.label}>
              Modèle *
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={s.input}
              placeholder="Ex: série sports"
              required
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="transmission" className={s.label}>
              Transmission *
            </label>
            <select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className={s.input}
              required
            >
              <option value="">Sélectionner</option>
              <option value="manual">Manuelle</option>
              <option value="automatic">Automatique</option>
            </select>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="year" className={s.label}>
              Année *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={s.input}
              min="1950"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="energy" className={s.label}>
              Énergie *
            </label>
            <select
              id="energy"
              name="energy"
              value={formData.energy}
              onChange={handleChange}
              className={s.input}
              required
            >
              <option value="">Sélectionner</option>
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybride">Hybride</option>
              <option value="Électrique">Électrique</option>
              <option value="GPL">GPL</option>
            </select>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="km" className={s.label}>
              Kilométrage (km) *
            </label>
            <input
              type="number"
              id="km"
              name="km"
              value={formData.km || ""}
              onChange={handleChange}
              className={s.input}
              min="0"
              placeholder="Ex: 50000"
              required
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="color" className={s.label}>
              Couleur *
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className={s.input}
              placeholder="Ex: Noir métallisé"
              required
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="place" className={s.label}>
              Nombre de places *
            </label>
            <input
              type="number"
              id="place"
              name="place"
              value={formData.place}
              onChange={handleChange}
              className={s.input}
              min="2"
              max="9"
              required
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="door" className={s.label}>
              Nombre de portes *
            </label>
            <input
              type="number"
              id="door"
              name="door"
              value={formData.door}
              onChange={handleChange}
              className={s.input}
              min="2"
              max="5"
              required
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="type" className={s.label}>
              Type de véhicule *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={s.input}
              required
            >
              <option value="">Sélectionner</option>
              <option value="sale">A vendre</option>
              <option value="rental">Location LLD</option>
            </select>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="status" className={s.label}>
              Statut *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={s.input}
              required
            >
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
              <option value="sold">Vendu</option>
            </select>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="price" className={s.label}>
              Prix {formData.type === "rental" ? "(€/mois)" : "(€)"} *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className={s.input}
              min="0"
              step="0.01"
              placeholder="Ex: 25000"
              required
            />
          </div>

          <div className={s.formGroupDescription}>
            <label htmlFor="description" className={s.label}>
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className={s.input}
              placeholder="Ex: ceci est une description plutot courte du véhicule mais vous pouvez en mettre une plus longue"
              required
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="image" className={s.label}>
              Image
            </label>
            {/* TODO import ImageUploader component */}
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={s.input}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className={s.buttonGroup}>
          <button type="submit" className={s.submitButton} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer le véhicule"}
          </button>
          <button
            type="button"
            className={s.cancelButton}
            onClick={handleBack}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormCreateVehicle;
