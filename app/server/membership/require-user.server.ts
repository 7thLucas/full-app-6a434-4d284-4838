import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import type { PublicUser } from "~/modules/authentication/authentication.types";

/**
 * Resolve the authenticated user from a React Router loader/action Request.
 * Throws a 401 Response when no valid session is present.
 */
export function requireUser(request: Request): PublicUser {
  const user = getUserFromRequest(request);
  if (!user) {
    throw new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}

export function optionalUser(request: Request): PublicUser | null {
  return getUserFromRequest(request);
}
