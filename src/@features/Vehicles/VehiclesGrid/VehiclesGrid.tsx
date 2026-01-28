import { mockVehicles } from "@/@mocks/mockCardVehicle";
import CardVehicle from "../CardVehicle/CardVehicle";
import s from "./styles.module.css";

function VehiclesGrid() {
  return (
    <div className={s.grid}>
      {mockVehicles.map((vehicle) => (
        <CardVehicle
          key={vehicle.id}
          image={vehicle.image}
          status={vehicle.status}
          brand={vehicle.brand}
          model={vehicle.model}
          location={vehicle.location}
          year={vehicle.year}
          km={vehicle.km}
          energy={vehicle.energy}
          price={vehicle.price}
        />
      ))}
    </div>
  );
}

export default VehiclesGrid;
