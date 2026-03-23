"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Gift,
  Users,
  BarChart3,
  Settings,
  Plus,
  QrCode,
} from "lucide-react";

export default function LoyaltyDashboardPage() {
  const [activeTab, setActiveTab] = useState("program");

  const [programName, setProgramName] = useState(
    () => "Coffee rewards",
  );

  const menuItems = [
    { id: "program", label: "Program", icon: Gift },
    { id: "members", label: "Members", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
              Loyalty card
            </p>
            <div className="grid lg:grid-cols-4 gap-8">
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <nav className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            activeTab === item.id
                              ? "bg-black text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </motion.aside>

              <div className="lg:col-span-3">
                {activeTab === "program" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
                  >
                    <h2 className="text-3xl font-bold text-black mb-2">Loyalty program</h2>
                    <p className="text-gray-600 mb-8">
                      Configure how customers earn and redeem rewards with your digital loyalty card.
                    </p>
                    <div className="space-y-6 max-w-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Program name
                        </label>
                        <input
                          type="text"
                          value={programName}
                          onChange={(e) => setProgramName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">
                          <p className="text-sm text-gray-600 mb-1">Earn rule</p>
                          <p className="font-semibold text-black">1 stamp per visit</p>
                          <button
                            type="button"
                            className="mt-3 text-sm font-medium text-black underline"
                          >
                            Edit rule
                          </button>
                        </div>
                        <div className="p-5 rounded-xl border border-gray-200 bg-gray-50">
                          <p className="text-sm text-gray-600 mb-1">Reward</p>
                          <p className="font-semibold text-black">Free drink after 8 stamps</p>
                          <button
                            type="button"
                            className="mt-3 text-sm font-medium text-black underline"
                          >
                            Edit reward
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center space-x-2 bg-black text-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add tier or perk</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "members" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
                  >
                    <h2 className="text-3xl font-bold text-black mb-6">Members</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <p className="text-gray-600">
                        Customers who saved your loyalty card to their wallet.
                      </p>
                      <button
                        type="button"
                        className="inline-flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Enrollment QR</span>
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                      {["Amina K.", "Jordan P.", "Sam T."].map((name, i) => (
                        <div
                          key={name}
                          className="flex items-center justify-between px-4 py-3 text-sm"
                        >
                          <span className="font-medium text-gray-900">{name}</span>
                          <span className="text-gray-500">{6 + i * 2} stamps</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "analytics" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
                  >
                    <h2 className="text-3xl font-bold text-black mb-6">Analytics</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm mb-2">Active members</p>
                        <p className="text-3xl font-bold text-black">428</p>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm mb-2">Stamps this month</p>
                        <p className="text-3xl font-bold text-black">1,902</p>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm mb-2">Rewards redeemed</p>
                        <p className="text-3xl font-bold text-black">74</p>
                      </div>
                    </div>
                    <div className="text-center py-12 text-gray-500 mt-4">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p>Detailed loyalty funnels coming soon</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
                  >
                    <h2 className="text-3xl font-bold text-black mb-6">Settings</h2>
                    <div className="space-y-4 max-w-lg">
                      <label className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg">
                        <span className="text-gray-800">Double stamps on birthdays</span>
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      </label>
                      <label className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg">
                        <span className="text-gray-800">Notify members when close to reward</span>
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" defaultChecked />
                      </label>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
