import { Mail, MapPin, Phone } from "lucide-react";
import s from "./styles.module.css";

function Footer() {
  return (
    <div className={s.container}>
      <div className={s.detailsContainer}>
        <div className={s.firstContainer}>
          <div className={s.title}>M-Motors</div>
          <>Votre partenaire de confiance pour tous vos véhicules</>
        </div>
        <div>
          <div className={s.title}>Nos services</div>
          <div>Véhicules d&apos;occasions</div>
          <div>Locations longue durée</div>
          <div>Financements</div>
          <div>Entretien SAV et dépannage</div>
          <div>Contrôle techniques et assurances</div>
        </div>
        <div>
          <div className={s.title}>Support</div>
          <div>FAQ</div>
          <div>Conditions générales</div>
          <div>Mentions légales</div>
        </div>
        <div className={s.lastContainer}>
          <div className={s.title}>Contact</div>
          <div className={s.icon}><MapPin size={20} />478 chemin des pins <br /> 33000 BORDEAUX</div>
          <div className={s.icon}><Phone size={20} /> 05 78 96 45 22</div>
          <div className={s.icon}><Mail size={20} />service-client@m-motors.com</div>
        </div>
      </div>
      <div className={s.copyright}>© 2026 M-Motors. Tous droits réservés.</div>
    </div>
  );
}

export default Footer;
