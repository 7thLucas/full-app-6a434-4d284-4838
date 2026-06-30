import { redirect, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useConfigurables } from "~/modules/configurables";
import { BrandLogo } from "~/components/navin/brand-logo";
import { Button } from "~/components/ui/button";
import {
  Droplet,
  UserPlus,
  Receipt,
  Users,
  Gift,
  Leaf,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/home");
  return null;
}

const STEP_ICONS = [UserPlus, Receipt, Users, Gift];

export default function LandingPage() {
  const { config } = useConfigurables();
  const appName = config?.appName ?? "Navin";
  const tagline = config?.tagline ?? "Sip sustainably. Grow the movement.";
  const heroHeadline = config?.heroHeadline ?? "Join the Navin community";
  const heroSub =
    config?.heroSubheadline ??
    "Verify your purchases, invite friends, and earn rewards for choosing sustainable water.";
  const heroCta = config?.heroCtaLabel ?? "Become a member";
  const heroImage = config?.heroImage;
  const howItWorks = config?.howItWorks ?? [];
  const showFuture = config?.showFutureVision ?? true;
  const futureHeading = config?.futureVisionHeading ?? "The road ahead";
  const future = config?.futureVision ?? [];
  const footerText = config?.footerText ?? "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth/register">Join</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/60 via-background to-background" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-14 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Leaf className="h-3.5 w-3.5" />
              {tagline}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {heroHeadline}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {heroSub}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/auth/register">
                  {heroCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link to="/auth/login">I&apos;m already a member</Link>
              </Button>
            </div>
          </div>

          {/* Hero visual */}
          <div className="mx-auto mt-12 max-w-md">
            {heroImage ? (
              <img
                src={heroImage}
                alt={appName}
                className="w-full rounded-3xl border border-border object-cover shadow-2xl shadow-primary/10"
              />
            ) : (
              <div className="relative flex aspect-[4/3] items-center justify-center rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-secondary shadow-2xl shadow-primary/10">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/30">
                  <Droplet className="h-12 w-12" />
                </div>
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-border bg-card/80 px-4 py-3 backdrop-blur">
                  <p className="text-sm font-semibold">Every bottle counts</p>
                  <p className="text-xs text-muted-foreground">
                    Real actions earn real rewards.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      {howItWorks.length > 0 && (
        <section className="mx-auto max-w-5xl px-5 py-14">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">How it works</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Four simple steps to start earning as part of the {appName} community.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Future vision (staged) */}
      {showFuture && future.length > 0 && (
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-5xl px-5 py-14">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-medium text-primary shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                What&apos;s coming
              </span>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{futureHeading}</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
                We&apos;re building the community first. These deeper sustainability features
                are on the way.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {future.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-dashed border-border bg-card/60 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    {item.badge && (
                      <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground shadow-xl shadow-primary/20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-foreground/10 blur-2xl" />
          <h2 className="relative text-2xl font-bold sm:text-3xl">
            Ready to make every sip count?
          </h2>
          <p className="relative mx-auto mt-2 max-w-md text-sm text-primary-foreground/80">
            Join {appName} today and start earning rewards for your sustainable choices.
          </p>
          <Button asChild size="lg" variant="secondary" className="relative mt-6">
            <Link to="/auth/register">
              {heroCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-8 text-center">
          <BrandLogo size="sm" />
          {footerText && (
            <p className="max-w-md text-xs text-muted-foreground">{footerText}</p>
          )}
        </div>
      </footer>
    </div>
  );
}
