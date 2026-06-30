import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useEffect, useState } from "react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { MemberShell } from "~/components/navin/member-shell";
import { useMember } from "~/components/navin/use-member";
import { useConfigurables } from "~/modules/configurables";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Users, Copy, Check, Share2, Gift, UserCheck } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

export default function ReferralsPage() {
  const { data, loading, refresh } = useMember();
  const { config } = useConfigurables();
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const inviterPoints = config?.pointsPerReferralInviter ?? 150;
  const inviteePoints = config?.pointsPerReferralInvitee ?? 75;

  const referralLink =
    data && origin ? `${origin}/auth/register?ref=${data.summary.referralCode}` : "";

  async function copyLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function shareLink() {
    if (!referralLink) return;
    const appName = config?.appName ?? "Navin";
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `Join ${appName}`,
          text: `Join me on ${appName} and we both earn rewards!`,
          url: referralLink,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  }

  async function applyCode() {
    if (!code.trim()) return;
    setApplying(true);
    setFeedback(null);
    try {
      const res = await fetch("/data/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: code.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.message ?? "Failed to apply code");
      setFeedback({ type: "success", message: json.message });
      setCode("");
      await refresh();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to apply code",
      });
    } finally {
      setApplying(false);
    }
  }

  return (
    <MemberShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invite friends</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your link — you earn{" "}
            <span className="font-semibold text-primary">{inviterPoints} points</span> and your
            friend gets{" "}
            <span className="font-semibold text-primary">{inviteePoints}</span> when they join.
          </p>
        </div>

        {loading || !data ? (
          <div className="space-y-4">
            <div className="h-40 animate-pulse rounded-3xl bg-secondary" />
            <div className="h-24 animate-pulse rounded-2xl bg-secondary" />
          </div>
        ) : (
          <>
            {/* Referral code card */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Your referral code
              </p>
              <p className="mt-1 text-3xl font-bold tracking-wider text-primary">
                {data.summary.referralCode}
              </p>

              <div className="mt-5 space-y-2">
                <Label className="text-xs text-muted-foreground">Your invite link</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={referralLink} className="text-xs" />
                  <Button size="icon" variant="outline" onClick={copyLink} aria-label="Copy link">
                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button onClick={shareLink}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" onClick={copyLink}>
                  {copied ? "Copied!" : "Copy link"}
                </Button>
              </div>
            </div>

            {/* Apply a referral code (only if not yet referred) */}
            {!data.summary.referredByCode && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Got a friend&apos;s code?</h2>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter it to claim your {inviteePoints}-point joining bonus.
                </p>
                {feedback && (
                  <div
                    className={
                      feedback.type === "success"
                        ? "mt-3 rounded-xl bg-primary/10 px-3 py-2 text-xs font-medium text-primary"
                        : "mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
                    }
                  >
                    {feedback.message}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="FRIEND CODE"
                    className="uppercase"
                  />
                  <Button onClick={applyCode} disabled={applying || !code.trim()}>
                    {applying ? "Applying…" : "Apply"}
                  </Button>
                </div>
              </div>
            )}

            {data.summary.referredByCode && (
              <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-xs font-medium text-secondary-foreground">
                <UserCheck className="h-4 w-4" />
                You joined with code {data.summary.referredByCode}.
              </div>
            )}

            {/* Referred friends */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Friends you&apos;ve invited</h2>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {data.summary.referralCount}
                </span>
              </div>
              {data.referred.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
                  <Users className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 text-sm font-medium">No referrals yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Share your link to start earning together.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                  {data.referred.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                          {r.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.username}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(r.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary">+{inviterPoints}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MemberShell>
  );
}
