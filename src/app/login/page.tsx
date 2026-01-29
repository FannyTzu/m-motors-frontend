import AuthComponent from "@/@features/Auth/AuthComponent"
import s from "./styles.module.css"


function LoginPage() {
  return (
    <div className={s.container}>
      <AuthComponent type="login" />
    </div>
  )
}

export default LoginPage