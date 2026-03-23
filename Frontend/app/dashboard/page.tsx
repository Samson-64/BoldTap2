"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardIndexPage() {
  const { selectedService } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (selectedService) {
      router.replace(`/dashboard/${selectedService}`);
    } else {
      router.replace("/select-service");
    }
  }, [selectedService, router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-3" />
        <p className="text-gray-600">Opening your dashboard…</p>
      </div>
    </ProtectedRoute>
  );
}
