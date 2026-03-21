import React from "react";
import s from "./styles.module.css";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ArrowBackProps {
  defaultRoute?: string;
  forceNavigate?: boolean;
}

function ArrowBack({
  defaultRoute = "/",
  forceNavigate = false,
}: ArrowBackProps) {
  const router = useRouter();

  const handleBack = () => {
    if (forceNavigate) {
      router.push(defaultRoute);
    } else {
      router.back();
    }
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
