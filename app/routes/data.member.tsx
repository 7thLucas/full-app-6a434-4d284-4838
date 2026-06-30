import type { LoaderFunctionArgs } from "react-router";
import { requireUser } from "~/server/membership/require-user.server";
import { MembershipService } from "~/server/membership/membership.service";
import { getServerConfig } from "~/server/membership/config.server";

/**
 * GET /data/member — full member hub payload: summary, points history,
 * recent purchases, referred members, and the rewards catalog.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const user = requireUser(request);
  const principal = { id: user.id, username: user.username, email: user.email };

  const [summary, history, purchases, referred, config] = await Promise.all([
    MembershipService.getSummary(principal),
    MembershipService.getPointsHistory(user.id),
    MembershipService.getPurchases(user.id),
    MembershipService.getReferredMembers(user.id),
    getServerConfig(),
  ]);

  return {
    summary,
    history,
    purchases,
    referred,
    rewardsCatalog: config.rewardsCatalog ?? [],
  };
}
