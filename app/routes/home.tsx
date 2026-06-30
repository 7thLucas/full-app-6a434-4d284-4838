import { redirect, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { MemberShell } from "~/components/navin/member-shell";
import { useMember } from "~/components/navin/use-member";
import { useConfigurables } from "~/modules/configurables";
import { Button } from "~/components/ui/button";
import {
  Sparkles,
  Receipt,
  Users,
  Gift,
  Award,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

function reasonLabel(reason: string): string {
  switch (reason) {
    case "join":
      return "Welcome bonus";
    case "purchase":
      return "Verified purchase";
    case "referral_inviter":
      return "Referral reward";
    case "referral_invitee":
      return "Referral bonus";
    case "redemption":
      return "Reward redeemed";
    default:
      return reason;
  }
}

export default function HomePage() {
  const { data, loading } = useMember();
  const { config } = useConfigurables();
  const communityName = config?.communityName ?? "Navin Community";

  return (
    <MemberShell>
      {loading || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Greeting */}
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-2xl font-bold text-foreground">{data.summary.username}</h1>
          </div>

          {/* Points hero card */}
          <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/20">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
                  Points balance
                </p>
                <p className="mt-1 text-4xl font-bold">{data.summary.pointsBalance}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
                  <Award className="h-3.5 w-3.5" />
                  {data.summary.tier.name}
                </span>
                <span className="text-[11px] text-primary-foreground/70">
                  {data.summary.lifetimePoints} lifetime
                </span>
              </div>
            </div>

            {data.summary.nextTier && (
              <div className="relative mt-5">
                <div className="flex items-center justify-between text-[11px] text-primary-foreground/80">
                  <span>{data.summary.tier.name}</span>
                  <span>
                    {data.summary.nextTier.pointsAway} pts to {data.summary.nextTier.name}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-primary-foreground/20">
                  <div
                    className="h-full rounded-full bg-primary-foreground transition-all"
                    style={{
                      width: `${tierProgress(
                        data.summary.lifetimePoints,
                        data.summary.tier.minPoints,
                        data.summary.nextTier.minPoints,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Receipt}
              label="Verified purchases"
              value={data.summary.verifiedPurchaseCount}
            />
            <StatCard
              icon={Users}
              label="Friends referred"
              value={data.summary.referralCount}
            />
          </div>

          {/* Quick actions */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Quick actions</h2>
            <div className="grid gap-3">
              <ActionRow
                to="/verify"
                icon={Receipt}
                title="Verify a purchase"
                subtitle="Earn points for buying sustainable water"
              />
              <ActionRow
                to="/referrals"
                icon={Users}
                title="Invite friends"
                subtitle="You both earn when they join"
              />
              <ActionRow
                to="/rewards"
                icon={Gift}
                title="Redeem rewards"
                subtitle="Turn your points into perks"
              />
            </div>
          </div>

          {/* Recent activity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                {communityName}
              </span>
            </div>
            {data.history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
                <Sparkles className="mx-auto h-6 w-6 text-primary" />
                <p className="mt-2 text-sm font-medium">No activity yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Verify a purchase or invite a friend to start earning.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {data.history.slice(0, 6).map((h, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {reasonLabel(h.reason)}
                      </p>
                      {h.description && (
                        <p className="text-xs text-muted-foreground">{h.description}</p>
                      )}
                    </div>
                    <span
                      className={
                        h.amount >= 0
                          ? "text-sm font-bold text-primary"
                          : "text-sm font-bold text-destructive"
                      }
                    >
                      {h.amount >= 0 ? "+" : ""}
                      {h.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </MemberShell>
  );
}

function tierProgress(lifetime: number, min: number, next: number): number {
  if (next <= min) return 100;
  return Math.min(100, Math.max(0, ((lifetime - min) / (next - min)) * 100));
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Receipt;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ActionRow({
  to,
  icon: Icon,
  title,
  subtitle,
}: {
  to: string;
  icon: typeof Receipt;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/10"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-40 rounded-lg bg-secondary" />
      <div className="h-40 rounded-3xl bg-secondary" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 rounded-2xl bg-secondary" />
        <div className="h-24 rounded-2xl bg-secondary" />
      </div>
      <div className="h-48 rounded-2xl bg-secondary" />
    </div>
  );
}
