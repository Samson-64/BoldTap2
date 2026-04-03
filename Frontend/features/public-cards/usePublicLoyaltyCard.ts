"use client";

import { useCallback, useEffect, useState } from "react";
import type { LoyaltyCustomer } from "@/contexts/lib/loyaltyCustomers";

interface PublicLoyaltyState {
  isHydrated: boolean;
  merchantId: string | null;
  pack: any; // Will be typed dynamically
  visitor: LoyaltyCustomer | null;
}

async function loadPublicLoyaltyState(
  slug: string,
): Promise<Omit<PublicLoyaltyState, "isHydrated">> {
  if (!slug) {
    return {
      merchantId: null,
      pack: null,
      visitor: null,
    };
  }

  const { findUserIdByLoyaltySlug } =
    await import("@/contexts/lib/userRegistry");
  const { getPublicLoyaltyCardBySlug } =
    await import("@/contexts/lib/loyaltyCard");
  const { getStoredVisitorCustomerId, getCustomer } =
    await import("@/contexts/lib/loyaltyCustomers");

  const merchantId = findUserIdByLoyaltySlug(slug);
  const pack = getPublicLoyaltyCardBySlug(slug);
  const visitorId = merchantId ? getStoredVisitorCustomerId(merchantId) : null;
  const visitor =
    merchantId && visitorId ? getCustomer(merchantId, visitorId) : null;

  return {
    merchantId,
    pack,
    visitor,
  };
}

export function usePublicLoyaltyCard(slug: string) {
  const [state, setState] = useState<PublicLoyaltyState>({
    isHydrated: false,
    merchantId: null,
    pack: null,
    visitor: null,
  });

  const refresh = useCallback(async () => {
    const newState = await loadPublicLoyaltyState(slug);
    setState((prev) => ({
      ...prev,
      ...newState,
    }));
  }, [slug]);

  useEffect(() => {
    const init = async () => {
      const initialState = await loadPublicLoyaltyState(slug);
      setState({
        isHydrated: true,
        ...initialState,
      });
    };
    init();
  }, [slug]);

  const joinProgram = useCallback(
    async (input: { name: string; phone?: string }) => {
      const name = input.name.trim();
      const phone = input.phone?.trim() || undefined;

      if (!state.merchantId || !name) {
        return false;
      }

      const { addCustomer, setStoredVisitorCustomerId } =
        await import("@/contexts/lib/loyaltyCustomers");

      const customer = addCustomer(state.merchantId, { name, phone });
      setStoredVisitorCustomerId(state.merchantId, customer.id);
      await refresh();

      return true;
    },
    [refresh, state.merchantId],
  );

  return {
    ...state,
    joinProgram,
  };
}
