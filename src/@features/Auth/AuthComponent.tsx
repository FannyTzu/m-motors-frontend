"use client"
import { useState } from 'react'
import s from './styles.module.css'

interface AuthComponentProps {
  type: 'login' | 'register'
}

function AuthComponent({ type }: AuthComponentProps) {

  const isRegister = type === 'register'

  const title = isRegister ? 'Créer un compte' : 'Connexion'
  const subtitle = isRegister ? 'Et trouver votre prochain véhicule !' : 'Accédez à votre espace'
  const buttonText = isRegister ? 'S\'INSCRIRE' : 'SE CONNECTER'
  const description = isRegister ? 'Pas encore de compte ?' : 'Déjà un compte ?'
  const redirection = isRegister ? 'Se connecter' : 'S\'inscrire'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAuth = () => { }

  return (
    <div className={s.container}>
      <div className={s.containerTitle}>
        <div className={s.title}>{title}</div>
        <div className={s.subtitle}>{subtitle}</div>
      </div>
      <div>
        <div className={s.containerInput}>
          <span>EMAIL</span>
          <input
            type="email"
            placeholder="exemple@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={s.input}
          />
        </div>
        <div className={s.containerInput}>
          <span>MOT DE PASSE</span>
          <input
            type="password"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={s.input}
          />
        </div>
        <button onClick={handleAuth} className={s.button}> {buttonText}</button>

        <div className={s.redirectionContainer}>
          <div>{description}</div>
          <div className={s.redirection}>{redirection}</div>
        </div>

      </div>
    </div>)
}

export default AuthComponent