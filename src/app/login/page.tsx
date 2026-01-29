"use client";
import AuthComponent from "@/@features/Auth/AuthComponent";
import s from "./styles.module.css";
import { useAuth } from "@/@features/Auth/useAuth";
import { useRouter } from "next/navigation";

function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      console.error(err);
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
      />
    </div>
  );
}

export default LoginPage;
