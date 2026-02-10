"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function BusinessSpaceUpdate() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return null;
}

export default BusinessSpaceUpdate;
