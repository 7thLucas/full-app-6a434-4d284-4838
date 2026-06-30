import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { MemberShell } from "~/components/navin/member-shell";
import { useMember } from "~/components/navin/use-member";
import { Button } from "~/components/ui/button";
import { Gift, Sparkles, CheckCircle2, Loader2, Coins } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

export default function RewardsPage() {
  const { data, loading, refresh } = useMember();
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  async function redeem(title: string) {
    setRedeeming(title);
    setFeedback(null);
    try {
      const res = await fetch("/data/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardTitle: title }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.message ?? "Could not redeem reward");
      setFeedback({ type: "success", message: `Redeemed "${json.reward}"! Check your email for details.` });
      await refresh();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Could not redeem reward",
      });
    } finally {
      setRedeeming(null);
    }
  }

  const balance = data?.summary.pointsBalance ?? 0;

  return (
    <MemberShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rewards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Turn your points into perks for sustainable living.
          </p>
        </div>

        {/* Balance pill */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
            <p className="text-2xl font-bold text-foreground">
              {balance} <span className="text-sm font-medium text-muted-foreground">points</span>
            </p>
          </div>
        </div>

        {feedback && (
          <div
            className={
              feedback.type === "success"
                ? "flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
                : "rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            }
          >
            {feedback.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
            {feedback.message}
          </div>
        )}

        {loading || !data ? (
          <div className="grid gap-3">
            <div className="h-28 animate-pulse rounded-2xl bg-secondary" />
            <div className="h-28 animate-pulse rounded-2xl bg-secondary" />
          </div>
        ) : data.rewardsCatalog.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
            <Gift className="mx-auto h-7 w-7 text-primary" />
            <p className="mt-2 text-sm font-medium">No rewards available yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Check back soon for new perks.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {data.rewardsCatalog.map((reward) => {
              const affordable = balance >= reward.cost;
              const isRedeeming = redeeming === reward.title;
              return (
                <div
                  key={reward.title}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <Gift className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-foreground">{reward.title}</h3>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                          <Sparkles className="h-3 w-3" />
                          {reward.cost}
                        </span>
                      </div>
                      {reward.description && (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {reward.description}
                        </p>
                      )}
                      <Button
                        className="mt-4 w-full"
                        variant={affordable ? "default" : "secondary"}
                        disabled={!affordable || isRedeeming}
                        onClick={() => redeem(reward.title)}
                      >
                        {isRedeeming ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Redeeming…
                          </>
                        ) : affordable ? (
                          "Redeem"
                        ) : (
                          `Need ${reward.cost - balance} more points`
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MemberShell>
  );
}
