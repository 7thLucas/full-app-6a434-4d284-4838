import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useRef, useState } from "react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { MemberShell } from "~/components/navin/member-shell";
import { useMember } from "~/components/navin/use-member";
import { useConfigurables } from "~/modules/configurables";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Receipt,
  Upload,
  CheckCircle2,
  ImageIcon,
  Loader2,
  X,
} from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getUserFromRequest(request)) return redirect("/auth/login");
  return null;
}

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "uploaded"; url: string; path?: string; previewName: string }
  | { status: "error"; message: string };

export default function VerifyPage() {
  const { data, loading, refresh } = useMember();
  const { config } = useConfigurables();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<UploadState>({ status: "idle" });
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const points = config?.pointsPerVerifiedPurchase ?? 50;

  async function handleFile(file: File) {
    setFeedback(null);
    setUpload({ status: "uploading" });
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/uploader/image", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok || !json?.success || !json?.data?.url) {
        throw new Error(json?.message ?? "Upload failed");
      }
      setUpload({
        status: "uploaded",
        url: json.data.url,
        path: json.data.path,
        previewName: file.name,
      });
    } catch (err) {
      setUpload({
        status: "error",
        message: err instanceof Error ? err.message : "Upload failed",
      });
    }
  }

  async function handleSubmit() {
    if (upload.status !== "uploaded") return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/data/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proofUrl: upload.url,
          proofPath: upload.path,
          reference: reference.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.message ?? "Could not verify purchase");
      }
      setFeedback({
        type: "success",
        message: `Purchase verified! You earned ${json.purchase.pointsAwarded} points.`,
      });
      setUpload({ status: "idle" });
      setReference("");
      await refresh();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Could not verify purchase",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MemberShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Verify a purchase</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a photo of your receipt or bottle code to earn{" "}
            <span className="font-semibold text-primary">{points} points</span>.
          </p>
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

        {/* Uploader */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />

          {upload.status === "uploaded" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card text-primary">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {upload.previewName}
                  </p>
                  <p className="text-xs text-primary">Ready to submit</p>
                </div>
                <button
                  onClick={() => setUpload({ status: "idle" })}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <img
                src={upload.url}
                alt="Proof of purchase"
                className="max-h-56 w-full rounded-xl border border-border object-contain"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={upload.status === "uploading"}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/30 py-10 transition-colors hover:border-primary/50 hover:bg-secondary/60 disabled:opacity-60"
            >
              {upload.status === "uploading" ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Uploading…</span>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Tap to upload proof of purchase
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Receipt photo or bottle code · JPG or PNG
                  </span>
                </>
              )}
            </button>
          )}

          {upload.status === "error" && (
            <p className="mt-3 text-sm text-destructive">{upload.message}</p>
          )}

          <div className="mt-4 space-y-2">
            <Label htmlFor="reference">
              Reference <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Receipt no., store, or bottle code"
            />
          </div>

          <Button
            className="mt-5 w-full"
            disabled={upload.status !== "uploaded" || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              <>
                <Receipt className="h-4 w-4" />
                Verify & earn {points} points
              </>
            )}
          </Button>
        </div>

        {/* History */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Your verifications</h2>
          {loading || !data ? (
            <div className="h-20 animate-pulse rounded-2xl bg-secondary" />
          ) : data.purchases.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
              <Receipt className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-sm font-medium">No purchases verified yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your first verification will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.purchases.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm"
                >
                  <img
                    src={p.proofUrl}
                    alt="proof"
                    className="h-12 w-12 rounded-lg border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {p.reference || "Verified purchase"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      <CheckCircle2 className="h-3 w-3" />
                      {p.status}
                    </span>
                    <span className="mt-1 text-xs font-bold text-primary">
                      +{p.pointsAwarded}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MemberShell>
  );
}
