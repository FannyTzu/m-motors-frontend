"use client";
import AuthComponent from "@/@features/Auth/AuthComponent";
import { useAuth } from "@/@features/Auth/useAuth";
import { useRouter } from "next/navigation";
import s from "./styles.module.css";

function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async (email: string, password: string) => {
    try {
      await register(email, password);
      router.replace("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = () => {
    router.replace("/login");
  };

  return (
    <div className={s.container}>
      <AuthComponent
        type="register"
        onSubmit={handleRegister}
        redirectionUrl={handleLogin}
      />
    </div>
  );
}

export default RegisterPage;
