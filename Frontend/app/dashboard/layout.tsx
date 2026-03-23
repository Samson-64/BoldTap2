"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isValidServiceId } from "@/contexts/lib/service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setSelectedService } = useAuth();

  useEffect(() => {
    const parts = pathname?.split("/").filter(Boolean) ?? [];
    if (parts[0] !== "dashboard" || parts.length < 2) return;
    const segment = parts[1];
    if (segment && isValidServiceId(segment)) {
      setSelectedService(segment);
    }
  }, [pathname, setSelectedService]);

  return <>{children}</>;
}
