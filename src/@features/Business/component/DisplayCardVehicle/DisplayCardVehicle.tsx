import React from "react";
import CardVehicleBusiness from "../CardVehicleBusiness/CardVehicleBusiness";
import { mockVehicles } from "@/@mocks/mockCardVehicle";

function DisplayCardVehicle() {
  return (
    <div>
      {mockVehicles.map((vehicle) => (
        <CardVehicleBusiness
          key={vehicle.id}
          image={vehicle.image}
          status={vehicle.status}
          brand={vehicle.brand}
          model={vehicle.model}
          year={vehicle.year}
          km={vehicle.km}
          energy={vehicle.energy}
          price={vehicle.price}
        />
      ))}
    </div>
  );
}

export default DisplayCardVehicle;
