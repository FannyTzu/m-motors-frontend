"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function FolderToConsultPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user-space");
  }, [router]);

  return null;
}

export default FolderToConsultPage;
