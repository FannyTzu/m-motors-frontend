import AuthComponent from "@/@features/Auth/AuthComponent"
import s from "./styles.module.css"

function RegisterPage() {
  return (
    <div className={s.container}>
      <AuthComponent type="register" />
    </div>
  )
}

export default RegisterPage