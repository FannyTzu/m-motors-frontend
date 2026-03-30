"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function CartPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user-space");
  }, [router]);

  return null;
}

export default CartPage;
