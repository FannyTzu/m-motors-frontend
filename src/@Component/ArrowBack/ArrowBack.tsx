import React from "react";
import s from "./styles.module.css";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function ArrowBack() {
  const router = useRouter();

  const handleBack = () => {
    const currentPath = window.location.pathname;
    router.back();
    setTimeout(() => {
      if (window.location.pathname === currentPath) {
        router.push("/");
      }
    }, 300);
  };

  return (
    <div>
      <button className={s.backButton} onClick={handleBack}>
        <ArrowLeft />
        Retour
      </button>
    </div>
  );
}

export default ArrowBack;
