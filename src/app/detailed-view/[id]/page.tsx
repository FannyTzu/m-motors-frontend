"use client";
import { useParams } from "next/navigation";
import DetailsViewContent from "@/@features/DetailedViewContent/DetailedViewContent";

function DetailsViewPage() {
  const params = useParams();
  const vehicleId = parseInt(params.id as string, 10);

  return <DetailsViewContent vehicleId={vehicleId} />;
}

export default DetailsViewPage;
