"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { isAdminAuthenticated } from "@/contexts/lib/adminAuth";

export default function ProtectedAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const authed = isAdminAuthenticated();
    setOk(authed);
    setReady(true);
    if (!authed) {
      router.replace("/admin/login");
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  if (!ok) return null;

  return <>{children}</>;
}
