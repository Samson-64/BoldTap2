"use client";

import { useEffect, useState } from "react";
import {
  getPublicCardBySlug,
  type NfcProfileData,
} from "@/contexts/lib/nfcProfile";

export interface PublicNfcCardData {
  profile: NfcProfileData | null;
  fallbackName: string;
  fallbackEmail: string;
}

export function usePublicNfcCard(slug: string) {
  const [data, setData] = useState<PublicNfcCardData | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!slug) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      const result = await getPublicCardBySlug(slug);
      setData(result);
    };

    fetchData();
  }, [slug]);

  return data;
}
