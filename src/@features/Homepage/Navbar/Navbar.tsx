"use client"
import { Briefcase, LogOut, User } from 'lucide-react';
import { useRouter } from "next/navigation";
import s from './styles.module.css';

function Navbar() {

  const router = useRouter();

  const handleSale = () => {
    router.replace('/sale');
  }
  const handleRental = () => {
    router.replace('/rental');
  }
  const handleUser = () => {
    router.replace('/user-space');
  }
  const handleBusiness = () => {
    router.replace('/business-space');
  }
  const handleHome = () => {
    router.replace('/');
  }

  return (
    <div className={s.container}>
      <div className={s.containerName} onClick={handleHome}>
        <div className={`${s.name} font-bold`}>M-Motors</div>
        <div>Depuis 1987</div>
      </div>

      <div className={s.containerButtons}>
        <button className={s.buttons} onClick={handleSale}><>Vente</></button>
        <button className={s.buttons} onClick={handleRental}> <>Location</></button>
        <button className={s.buttons} onClick={handleUser}><User size={20} /> <div>Mon espace</div></button>
        <button className={s.buttons} onClick={handleBusiness}><Briefcase size={20} /> <div>Espace Pro</div></button>
        <button className={s.buttons} ><LogOut size={20} /><div>Déconnexion</div></button>
      </div>

    </div>
  )
}

export default Navbar