"use client";
import AuthComponent from "@/@features/Auth/component/AuthComponent";
import { useAuth } from "@/@features/Auth/hook/useAuth";
import { useRouter } from "next/navigation";
import s from "./styles.module.css";
import { useState } from "react";

function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (email: string, password: string) => {
    try {
      setError("");
      setSuccess("");
      const { user } = await register(email, password);
      setSuccess("Compte créé avec succès !");
      setTimeout(() => {
        const isUser = user?.role === "user";
        router.replace(isUser ? "/user-space" : "/business-space");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de l'inscription");
      }
    }
  };

  const handleRedirect = () => {
    router.replace("/login");
  };

  return (
    <div className={s.container}>
      <AuthComponent
        type="register"
        onSubmit={handleRegister}
        redirectionUrl={handleRedirect}
        error={error}
        success={success}
      />
    </div>
  );
}

export default RegisterPage;
