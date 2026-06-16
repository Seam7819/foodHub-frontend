"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({
  children,
}: Props) => {
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;