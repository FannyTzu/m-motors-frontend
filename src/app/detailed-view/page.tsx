"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function DetailsViewPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return null;
}

export default DetailsViewPage;
