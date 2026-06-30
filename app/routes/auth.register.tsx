import { redirect, useActionData, useNavigation, useSearchParams, Form, Link } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  getUserFromRequest,
  signJwt,
  buildAuthCookie,
} from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { MembershipService } from "~/server/membership/membership.service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Droplet } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/home");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const referralCode = String(formData.get("referralCode") ?? "").trim();
  try {
    const user = await AuthService.register({
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    // Create the membership (also awards welcome points).
    await MembershipService.ensureMembership({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    // Apply referral if a code was supplied — best effort, never blocks signup.
    if (referralCode) {
      try {
        await MembershipService.applyReferral(
          { id: user.id, username: user.username, email: user.email },
          referralCode,
        );
      } catch {
        // Ignore invalid/self referral at signup; member can retry later.
      }
    }

    const token = signJwt({
      sub: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
      email_verified: user.email_verified,
    });
    return redirect("/home", {
      headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) },
    });
  } catch (error: any) {
    return { error: error.message ?? "Registration failed" };
  }
}

export default function RegisterRoute() {
  const actionData = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === "submitting";
  const refFromUrl = searchParams.get("ref") ?? "";
  const { config } = useConfigurables();
  const appName = config?.appName ?? "Navin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Droplet className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Join {appName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Become a member and start earning for sustainable choices.
          </p>
        </div>

        <Card className="w-full border-border shadow-xl shadow-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold">Create your account</CardTitle>
            <CardDescription>It takes less than a minute.</CardDescription>
          </CardHeader>

          <Form method="post">
            <CardContent className="space-y-4">
              {actionData?.error && (
                <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {actionData.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Name</Label>
                <Input id="username" name="username" type="text" placeholder="Your name" required autoComplete="username" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} placeholder="At least 8 characters" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode">
                  Referral code <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  defaultValue={refFromUrl}
                  placeholder="Have a friend's code?"
                  className="uppercase"
                />
                {refFromUrl && (
                  <p className="text-xs text-primary">A referral code was applied from your invite link.</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already a member?{" "}
                <Link to="/auth/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Form>
        </Card>
      </div>
    </div>
  );
}
