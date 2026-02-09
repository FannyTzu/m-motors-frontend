"use client";

import DetailsViewContent from "@/@features/DetailedViewContent/DetailedViewContent";
import { Suspense } from "react";
import s from "./styles.module.css";

function DetailsViewPage() {
  return (
    <Suspense fallback={<div className={s.loading}>Chargement ...</div>}>
      <DetailsViewContent />
    </Suspense>
  );
}

export default DetailsViewPage;
