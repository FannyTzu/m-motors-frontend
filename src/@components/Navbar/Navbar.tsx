import { Briefcase, LogOut, User } from 'lucide-react'
import s from './styles.module.css'

function Navbar() {
  return (
    <div className={s.container}>
      <div className={s.containerName}>
        <div className={`${s.name} font-bold`}>M-Motors</div>
        <div>Depuis 1987</div>
      </div>

      <div className={s.containerButtons}>
        <button className={s.buttons}><>Vente</></button>
        <button className={s.buttons}> <>Location</></button>
        <button className={s.buttons}><User size={20} /> <div>Mon espace</div></button>
        <button className={s.buttons}><Briefcase size={20} /> <div>Espace Pro</div></button>
        <button className={s.buttons}><LogOut size={20} /><div>Déconnexion</div></button>
      </div>

    </div>
  )
}

export default Navbar