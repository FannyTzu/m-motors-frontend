"use client";
import { ArrowBigRight, CalendarDays, Fuel, Gauge } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import s from "./styles.module.css";

interface CardVehicleProps {
  image: string;
  status: string;
  brand: string;
  model: string;
  location: string;
  year: number;
  km: number;
  energy: string;
  price: number;
}

function CardVehicleBusiness({
  image,
  status,
  brand,
  model,
  location,
  year,
  km,
  energy,
  price,
}: CardVehicleProps) {
  return <div></div>;
}

export default CardVehicleBusiness;
