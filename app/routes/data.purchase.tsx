import type { ActionFunctionArgs } from "react-router";
import { requireUser } from "~/server/membership/require-user.server";
import { MembershipService } from "~/server/membership/membership.service";

/**
 * POST /data/purchase — submit a proof-of-purchase verification.
 * Body: { proofUrl, proofPath?, reference? }
 * The image bytes are uploaded separately via /api/uploader/image first;
 * this endpoint records the verification and awards points.
 */
export async function action({ request }: ActionFunctionArgs) {
  const user = requireUser(request);
  let proofUrl = "";
  let proofPath: string | undefined;
  let reference: string | undefined;

  try {
    const body = await request.json();
    proofUrl = String(body?.proofUrl ?? "");
    proofPath = body?.proofPath ? String(body.proofPath) : undefined;
    reference = body?.reference ? String(body.reference) : undefined;
  } catch {
    const form = await request.formData().catch(() => null);
    proofUrl = String(form?.get("proofUrl") ?? "");
    proofPath = form?.get("proofPath") ? String(form.get("proofPath")) : undefined;
    reference = form?.get("reference") ? String(form.get("reference")) : undefined;
  }

  try {
    const purchase = await MembershipService.submitPurchase(
      { id: user.id, username: user.username, email: user.email },
      { proofUrl, proofPath, reference },
    );
    return { success: true, purchase };
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message ?? "Failed to submit purchase" },
      { status: error.statusCode ?? 400 },
    );
  }
}
