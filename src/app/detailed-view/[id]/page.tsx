"use client";
import { Suspense } from "react";
import s from "../styles.module.css";
import { useParams } from "next/navigation";
import DetailsViewContent from "@/@features/DetailedViewContent/DetailedViewContent";

function DetailsViewPage() {
  const params = useParams();
  const vehicleId = parseInt(params.id as string, 10);

  return (
    <Suspense fallback={<div className={s.loading}>Chargement ...</div>}>
      <DetailsViewContent vehicleId={vehicleId} />
    </Suspense>
  );
}

export default DetailsViewPage;
