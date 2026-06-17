"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {
      router.push("/");
    }
  }, [router]);

  return <>{children}</>;
}
