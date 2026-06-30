import type { ActionFunctionArgs } from "react-router";
import { requireUser } from "~/server/membership/require-user.server";
import { MembershipService } from "~/server/membership/membership.service";

/**
 * POST /data/reward — redeem a reward from the catalog by title.
 * Body: { rewardTitle }
 */
export async function action({ request }: ActionFunctionArgs) {
  const user = requireUser(request);
  let rewardTitle = "";
  try {
    const body = await request.json();
    rewardTitle = String(body?.rewardTitle ?? "");
  } catch {
    const form = await request.formData().catch(() => null);
    rewardTitle = String(form?.get("rewardTitle") ?? "");
  }

  try {
    const result = await MembershipService.redeemReward(
      { id: user.id, username: user.username, email: user.email },
      rewardTitle,
    );
    return { success: true, ...result };
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message ?? "Failed to redeem reward" },
      { status: error.statusCode ?? 400 },
    );
  }
}
