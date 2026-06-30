import type { ActionFunctionArgs } from "react-router";
import { requireUser } from "~/server/membership/require-user.server";
import { MembershipService } from "~/server/membership/membership.service";

/**
 * POST /data/referral — apply a referral code for the current member.
 * Body: { referralCode }
 */
export async function action({ request }: ActionFunctionArgs) {
  const user = requireUser(request);
  let referralCode = "";
  try {
    const body = await request.json();
    referralCode = String(body?.referralCode ?? "");
  } catch {
    const form = await request.formData().catch(() => null);
    referralCode = String(form?.get("referralCode") ?? "");
  }

  try {
    const result = await MembershipService.applyReferral(
      { id: user.id, username: user.username, email: user.email },
      referralCode,
    );
    return { success: true, message: `Referral from ${result.inviter} applied!` };
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message ?? "Failed to apply referral" },
      { status: error.statusCode ?? 400 },
    );
  }
}
