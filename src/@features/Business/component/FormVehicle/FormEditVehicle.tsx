"use client";
import React from "react";
import s from "./styles.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getVehicleById,
  updateVehicle,
  uploadVehicleImage,
} from "@/@features/Vehicles/service/vehicle.service";
import { CircleX, Upload } from "lucide-react";
import Image from "next/image";

interface FormEditVehicleProps {
  vehicleId: number;
}

interface VehicleData {
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

function FormEditVehicle({ vehicleId }: FormEditVehicleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<VehicleData>({
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

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVehicleById(vehicleId);
        setFormData(data);
        if (data.image) {
          setImagePreview(data.image);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image valide (JPEG ou PNG)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5 MB");
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormSubmitting(true);
    setError(null);

    try {
      await updateVehicle(vehicleId, formData);
      console.log("Véhicule modifié:", formData);

      if (imageFile) {
        const result = await uploadVehicleImage(vehicleId, imageFile);
        console.log("Image uploadée:", result.publicUrl);
      }

      router.push("/business-space");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la modification du véhicule"
      );
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className={s.container}>
        <div className={s.form}>
          <h2 className={s.formTitle}>Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <form onSubmit={handleSubmit} className={s.form}>
        <h2 className={s.formTitle}>Modifier le véhicule</h2>
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

          <div className={s.formGroup}>
            <label htmlFor="image" className={s.label}>
              Image
            </label>
            <div className={s.imageUploadContainer}>
              {imagePreview && (
                <div className={s.imagePreviewWrapper}>
                  <Image
                    src={imagePreview}
                    alt="Prévisualisation"
                    width={100}
                    height={100}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <div className={s.fileInputWrapper}>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className={s.fileInput}
                  accept="image/jpeg,image/jpg,image/png"
                />
                <label htmlFor="image" className={s.fileInputLabel}>
                  <Upload size={18} />
                  {imageFile ? imageFile.name : "Choisir une image"}
                </label>
              </div>
            </div>
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
        </div>

        <div className={s.buttonGroup}>
          <button
            type="submit"
            className={s.submitButton}
            disabled={isFormSubmitting}
          >
            {isFormSubmitting
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </button>
          <button
            type="button"
            className={s.cancelButton}
            onClick={handleBack}
            disabled={isFormSubmitting}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormEditVehicle;
