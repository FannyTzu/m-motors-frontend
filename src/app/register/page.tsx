'use client'
import AuthComponent from "@/@features/Auth/AuthComponent";
import { fetcher } from "@/@lib/fetcher";
import { useRouter } from "next/navigation";
import s from "./styles.module.css";

function RegisterPage() {

  const router = useRouter();

  const handleRegister = async (email: string, password: string) => {
    try {
      const response = await fetcher('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      console.log('Success:', response)
      router.replace('/');
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className={s.container}>
      <AuthComponent type="register" onSubmit={handleRegister} />
    </div>
  )
}

export default RegisterPage