"use client";
import { useState } from "react";
import s from "./styles.module.css";

interface AuthComponentProps {
  type: "login" | "register";
  onSubmit?: (email: string, password: string) => void;
  redirectionUrl?: () => void;
}

function AuthComponent({ type, onSubmit, redirectionUrl }: AuthComponentProps) {
  const isRegister = type === "register";

  const title = isRegister ? "Créer un compte" : "Connexion";
  const subtitle = isRegister
    ? "Et trouver votre prochain véhicule !"
    : "Accédez à votre espace";
  const buttonText = isRegister ? "S'INSCRIRE" : "SE CONNECTER";
  const description = isRegister
    ? "Déjà un compte ?"
    : "Pas encore de compte ?";
  const redirection = isRegister ? "Se connecter" : "S'inscrire";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={s.container}>
      <div className={s.containerTitle}>
        <div className={s.title}>{title}</div>
        <div className={s.subtitle}>{subtitle}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={s.containerInput}>
          <span className={s.label}>EMAIL</span>
          <input
            type="email"
            placeholder="exemple@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={s.input}
          />
        </div>
        <div className={s.containerInput}>
          <span className={s.label}>MOT DE PASSE</span>
          <input
            type="password"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={s.input}
          />
        </div>

        <button
          onClick={() => onSubmit && onSubmit(email, password)}
          className={s.button}
        >
          {" "}
          {buttonText}
        </button>
      </form>

      <div className={s.redirectionContainer}>
        <div>{description}</div>
        <div className={s.redirection} onClick={redirectionUrl}>
          {redirection}
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
