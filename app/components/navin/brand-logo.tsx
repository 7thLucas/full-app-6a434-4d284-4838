import { Droplet } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

interface BrandLogoProps {
  className?: string;
  showName?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Brand mark for Navin. Uses the configurable logoUrl when set, otherwise
 * falls back to a droplet mark in brand colors. App name comes from config.
 */
export function BrandLogo({ className, showName = true, size = "md" }: BrandLogoProps) {
  const { config } = useConfigurables();
  const appName = config?.appName ?? "Navin";
  const logoUrl = config?.logoUrl;

  const box = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const icon = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {logoUrl ? (
        <img src={logoUrl} alt={appName} className={cn(box, "rounded-xl object-cover")} />
      ) : (
        <div
          className={cn(
            box,
            "flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20",
          )}
        >
          <Droplet className={icon} />
        </div>
      )}
      {showName && (
        <span className={cn(text, "font-bold tracking-tight text-foreground")}>{appName}</span>
      )}
    </div>
  );
}
