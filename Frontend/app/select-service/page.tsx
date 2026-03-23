"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Gift, MailOpen, ArrowRight, Loader2 } from "lucide-react";

const services = [
  {
    id: "nfc-business" as const,
    title: "NFC Business card",
    description:
      "Digital business card with NFC tap and share — profile, links, and leads in one place.",
    icon: CreditCard,
  },
  {
    id: "loyalty" as const,
    title: "Loyalty card",
    description:
      "Reward returning customers with stamps, points, and tier perks they can carry on their phone.",
    icon: Gift,
  },
  {
    id: "e-invitation" as const,
    title: "E-invitation card",
    description:
      "Send stylish digital invites, track RSVPs, and keep event details in one shareable link.",
    icon: MailOpen,
  },
];

export default function SelectServicePage() {
  const { selectedService, setSelectedService } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (selectedService) {
      router.replace(`/dashboard/${selectedService}`);
    }
  }, [selectedService, router]);

  if (selectedService) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-10 h-10 animate-spin text-black" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
                Choose your service
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Pick the BoldTap product you want to manage. Each has its own
                dashboard tailored to that experience.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.button
                    key={service.id}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    onClick={() => {
                      setSelectedService(service.id);
                      router.push(`/dashboard/${service.id}`);
                    }}
                    className="text-left bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-black mb-2">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-semibold text-black">
                      Open dashboard
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <p className="text-center text-sm text-gray-500 mt-10">
              You can switch services anytime from your dashboard navigation.
            </p>
            <p className="text-center mt-2">
              <Link
                href="/"
                className="text-sm font-medium text-black underline-offset-4 hover:underline"
              >
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
