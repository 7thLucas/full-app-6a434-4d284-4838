import { useCallback, useEffect, useState } from "react";

export interface MemberSummary {
  userId: string;
  username: string;
  email: string;
  referralCode: string;
  pointsBalance: number;
  lifetimePoints: number;
  referralCount: number;
  verifiedPurchaseCount: number;
  referredByCode: string | null;
  tier: { name: string; minPoints: number };
  nextTier: { name: string; minPoints: number; pointsAway: number } | null;
}

export interface PointsHistoryItem {
  amount: number;
  reason: string;
  description?: string;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  proofUrl: string;
  reference?: string;
  status: string;
  pointsAwarded: number;
  createdAt: string;
}

export interface ReferredMember {
  username: string;
  joinedAt: string;
}

export interface RewardItem {
  title: string;
  description?: string;
  cost: number;
}

export interface MemberData {
  summary: MemberSummary;
  history: PointsHistoryItem[];
  purchases: PurchaseItem[];
  referred: ReferredMember[];
  rewardsCatalog: RewardItem[];
}

interface UseMemberResult {
  data: MemberData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Loads the authenticated member's hub data from /data/member.
 * Redirects to login on 401.
 */
export function useMember(): UseMemberResult {
  const [data, setData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/data/member", {
        headers: { Accept: "application/json" },
      });
      if (res.status === 401) {
        if (typeof window !== "undefined") window.location.href = "/auth/login";
        return;
      }
      if (!res.ok) throw new Error(`Failed to load member data (${res.status})`);
      const json = (await res.json()) as MemberData;
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load member data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
