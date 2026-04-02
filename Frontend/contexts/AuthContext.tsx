"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import {
  User,
  login as loginUser,
  register as registerUser,
  logout as logoutUser,
  getCurrentUser,
  getAuthToken,
} from "@/contexts/lib/auth";
import {
  ServiceId,
  getSelectedService,
  setStoredService,
  clearStoredService,
} from "@/contexts/lib/service";
import {
  syncAcquiredService,
  ensureNfcPublicSlug,
  ensureLoyaltyPublicSlug,
} from "@/contexts/lib/userRegistry";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  selectedService: ServiceId | null;
  setSelectedService: (id: ServiceId) => void;
  clearSelectedService: () => void;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedServiceState] = useState<ServiceId | null>(
    null,
  );
  const router = useRouter();
  const isHydrated = useRef(false);

  useEffect(() => {
    let active = true;

    const hydrateAuthState = async () => {
      if (isHydrated.current) return;
      isHydrated.current = true;

      const storedService = getSelectedService();
      if (storedService) {
        setSelectedServiceState(storedService);
      }

      const token = getAuthToken();
      if (!token) {
        if (!active) return;
        setUser(null);
        setLoading(false);
        return;
      }

      const currentUser = getCurrentUser();
      if (currentUser && active) {
        setUser(currentUser);
        setLoading(false);
        return;
      }

      // Only fetch from server if no local user
      try {
        const freshUser = await getCurrentUserFromServer();
        if (!active) return;

        if (!freshUser) {
          await logoutUser();
          clearStoredService();
          setSelectedServiceState(null);
          setUser(null);
        } else {
          setUser(freshUser);
        }
      } catch {
        // Silent fail - user will be logged out
      }

      setLoading(false);
    };

    void hydrateAuthState();

    return () => {
      active = false;
    };
  }, []);

  const setSelectedService = useCallback((id: ServiceId) => {
    setStoredService(id);
    setSelectedServiceState(id);
    const u = getCurrentUser();
    if (u) {
      syncAcquiredService(u.id, id);
      if (id === "nfc-business") {
        ensureNfcPublicSlug(u.id);
      }
      if (id === "loyalty") {
        ensureLoyaltyPublicSlug(u.id);
      }
    }
  }, []);

  const clearSelectedService = useCallback(() => {
    clearStoredService();
    setSelectedServiceState(null);
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await loginUser(email, password, rememberMe);
      if (response.success && response.user) {
        clearStoredService();
        setSelectedServiceState(null);
        setUser(response.user);
        router.push("/select-service");
        return { success: true };
      } else {
        return { success: false, error: response.error || "Login failed" };
      }
    } catch {
      return { success: false, error: "An error occurred during login" };
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await registerUser(name, email, phone, password);
      if (response.success && response.user) {
        clearStoredService();
        setSelectedServiceState(null);
        setUser(response.user);
        router.push("/select-service");
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Registration failed",
        };
      }
    } catch {
      return { success: false, error: "An error occurred during registration" };
    }
  };

  const logout = useCallback(() => {
    void logoutUser();
    clearStoredService();
    setUser(null);
    setSelectedServiceState(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        selectedService,
        setSelectedService,
        clearSelectedService,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Separate function to avoid hoisting issues
async function getCurrentUserFromServer(): Promise<import("@/contexts/lib/auth").User | null> {
  const { getCurrentUserFromServer: fetchUser } = await import("@/contexts/lib/auth");
  return fetchUser();
}
