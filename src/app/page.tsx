import s from "./page.module.css";
import DisplayCardVehicle from "@/@features/Vehicles/component/DisplayCardVehicle/DisplayCardVehicle";

export default function Home() {
  return (
    <div className={s.page}>
      <div className={s.banner}>
        <div className={s.title}>Nos véhicules disponibles</div>
        <div className={s.subtitle}>
          Découvrez notre sélection de véhicules vérifiés et garantis !
        </div>
      </div>

      <div className={s.newOffers}>
        <div className={s.titleNewOffers}>
          Nouveau : Location longue durée !
        </div>
        <div>Roulez en sécurité avec notre nouvelle offre.</div>
      </div>

      <DisplayCardVehicle />
    </div>
  );
}
