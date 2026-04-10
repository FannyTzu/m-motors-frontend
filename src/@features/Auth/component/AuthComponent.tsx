"use client";
import { useState } from "react";
import s from "./styles.module.css";
import { TriangleAlert, CheckCircle } from "lucide-react";

interface AuthComponentProps {
  type: "login" | "register";
  onSubmit?: (email: string, password: string) => void;
  redirectionUrl?: () => void;
  error?: string;
  success?: string;
}

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

function validatePassword(password: string): PasswordValidation {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    isValid:
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
}

function AuthComponent({
  type,
  onSubmit,
  redirectionUrl,
  error,
  success,
}: AuthComponentProps) {
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

  const passwordValidation = validatePassword(password);
  const showPasswordValidation = isRegister && password.length > 0;
  const isFormValid =
    email && (isRegister ? passwordValidation.isValid : password);

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
          {showPasswordValidation && (
            <div className={s.validationContainer}>
              <div
                className={passwordValidation.minLength ? s.success : s.error}
              >
                {passwordValidation.minLength ? (
                  <CheckCircle size={16} />
                ) : (
                  <TriangleAlert size={16} />
                )}
                Minimum 8 caractères
              </div>
              <div
                className={
                  passwordValidation.hasUppercase ? s.success : s.error
                }
              >
                {passwordValidation.hasUppercase ? (
                  <CheckCircle size={16} />
                ) : (
                  <TriangleAlert size={16} />
                )}
                1 majuscule
              </div>
              <div
                className={passwordValidation.hasNumber ? s.success : s.error}
              >
                {passwordValidation.hasNumber ? (
                  <CheckCircle size={16} />
                ) : (
                  <TriangleAlert size={16} />
                )}
                1 chiffre
              </div>
              <div
                className={
                  passwordValidation.hasSpecialChar ? s.success : s.error
                }
              >
                {passwordValidation.hasSpecialChar ? (
                  <CheckCircle size={16} />
                ) : (
                  <TriangleAlert size={16} />
                )}
                1 caractère spécial
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className={s.error}>
            <TriangleAlert size={16} /> {error}
          </div>
        )}
        {success && (
          <div className={s.success}>
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <button
          onClick={() => onSubmit && onSubmit(email, password)}
          disabled={isRegister && !isFormValid}
          className={s.button}
        >
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
