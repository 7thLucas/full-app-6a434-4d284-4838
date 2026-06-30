import { NavLink, useNavigate } from "react-router";
import { Home, Receipt, Gift, Users, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { BrandLogo } from "./brand-logo";

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/verify", label: "Verify", icon: Receipt },
  { to: "/referrals", label: "Invite", icon: Users },
  { to: "/rewards", label: "Rewards", icon: Gift },
];

interface MemberShellProps {
  children: ReactNode;
}

/**
 * Mobile-first member hub shell: top app bar + bottom tab bar, centered on a
 * phone-width column that scales gracefully up to web.
 */
export function MemberShell({ children }: MemberShellProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    // Hit the logout action; it clears the cookie and redirects.
    await fetch("/auth/logout", { method: "POST" });
    navigate("/auth/login", { replace: true });
    if (typeof window !== "undefined") window.location.href = "/auth/login";
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background sm:max-w-lg">
        {/* Top app bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-navbar/95 px-5 py-3 backdrop-blur supports-[backdrop-filter]:bg-navbar/80">
          <BrandLogo size="sm" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-5 pb-28 pt-5">{children}</main>

        {/* Bottom tab bar */}
        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md sm:max-w-lg">
          <div className="m-3 flex items-center justify-around rounded-2xl border border-border bg-card/95 px-2 py-2 shadow-lg shadow-primary/10 backdrop-blur">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                        isActive ? "bg-primary/10" : "bg-transparent",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
