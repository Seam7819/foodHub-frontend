"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  role: string;
};

const RoleGuard = ({
  children,
  role,
}: Props) => {
  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (
      user &&
      user.role !== role
    ) {
      router.push("/");
    }
  }, [user, role, router]);

  return <>{children}</>;
};

export default RoleGuard;