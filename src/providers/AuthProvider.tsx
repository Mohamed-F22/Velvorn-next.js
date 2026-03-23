"use client";

import { useEffect } from "react";
import { useAuthStore } from "../Stores/AuthStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.user) {
        setUser(data.user);
      }
    };

    checkUser();
  }, [setUser]);

  return <>{children}</>;
}
