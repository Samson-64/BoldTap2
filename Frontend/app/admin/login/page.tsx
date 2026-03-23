"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Shield } from "lucide-react";
import {
  isAdminAuthenticated,
  loginAdmin,
} from "@/contexts/lib/adminAuth";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!password) {
      setError("Enter the admin password");
      setLoading(false);
      return;
    }
    if (loginAdmin(password)) {
      router.replace("/admin");
    } else {
      setError("Invalid password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center">
            <Shield className="w-7 h-7" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-black mb-2">
          Admin sign in
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Set <code className="text-xs bg-gray-100 px-1 rounded">NEXT_PUBLIC_BOLDTAP_ADMIN_PASSWORD</code>{" "}
          in production. Default for local dev:{" "}
          <code className="text-xs bg-gray-100 px-1 rounded">boldtap-admin</code>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </form>
        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-black underline">
            Back to site
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
