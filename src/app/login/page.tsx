"use client";
import AuthComponent from "@/@features/Auth/component/AuthComponent";
import s from "./styles.module.css";
import { useAuth } from "@/@features/Auth/hook/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      setError("");
      await login(email, password);
      router.replace("/user-space");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("fetch") || err.message.includes("Network")) {
          setError("Erreur de connexion au serveur");
        } else {
          setError(err.message);
        }
      } else {
        setError("Erreur de connexion");
      }
    }
  };

  const handleRegister = () => {
    router.replace("/register");
  };

  return (
    <div className={s.container}>
      <AuthComponent
        type="login"
        onSubmit={handleLogin}
        redirectionUrl={handleRegister}
        error={error}
      />
    </div>
  );
}

export default LoginPage;
