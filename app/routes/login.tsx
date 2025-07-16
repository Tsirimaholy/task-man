import { Loader } from "lucide-react";
import {
  data,
  Form,
  href,
  NavLink,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import Input from "~/components/form-input/input";
import Label from "~/components/form-input/label";
import { H6, Paragraph } from "~/components/typography";
import { Button } from "~/components/ui/button";
import { genJwt, requireIsAnonymous, verifyUserPassword } from "~/lib/auth";
import { authCookieStorage } from "~/lib/session";
import type { Route } from "./+types/login";

export const loader = async ({ request }: Route.LoaderArgs) => {
  await requireIsAnonymous(request);
  return null;
};

export const action = async ({ request }: Route.ActionArgs) => {
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  // login and set cookie
  const isAuthentic = await verifyUserPassword(email, password);
  let jwt = null;
  if (isAuthentic) {
    jwt = await genJwt(isAuthentic);
    const session = await authCookieStorage.getSession();
    session.set("jwt", jwt);
    session.set("user", isAuthentic);

    const redirectTo = new URL(request.url).searchParams.get("redirectTo");
    return redirect(`${redirectTo ? redirectTo : href("/")}`, {
      headers: {
        "set-cookie": await authCookieStorage.commitSession(session, {
          maxAge: 60 * 60 * 24,
        }),
      },
    });
  } else {
    return data({
      success: false,
      errors: {
        globalError: "",
        email: ["Invalid email"],
        password: ["Wrong Password"],
      },
    });
  }
};
export default function Loging() {
  const navigation = useNavigation();
  const data = useActionData<typeof action>();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border rounded-md p-7 py-8 shadow-xs">
        <H6>Login to Task Man</H6>
        <Paragraph
          className="text-sm"
          textColorClassName="text-muted-foreground"
        >
          Enter your credential to access your account
        </Paragraph>
        <Form className="mt-4" method="POST">
          <div className="mb-5">
            <Label htmlFor="email" isError={!!data?.errors.email.length}>
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              isError={!!data?.errors.email.length}
              errorMessage={
                data?.errors.email.length ? data?.errors.email[0] : undefined
              }
            />
          </div>
          <div className="mb-5">
            <Label htmlFor="password" isError={!!data?.errors.password.length}>
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              isError={!!data?.errors.password.length}
              errorMessage={
                data?.errors.password.length
                  ? data?.errors.password[0]
                  : undefined
              }
            />
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={navigation.state !== "idle"}
          >
            {navigation.state === "submitting" ? (
              <>
                Submitting...
                <Loader className="animate-spin" />
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <NavLink to={href("/")} className={"font-bold underline"}>
            Forgot password?
          </NavLink>
          <Paragraph>
            Don't have an account?{" "}
            <NavLink to={href("/")} className={"font-bold hover:underline"}>
              Signup
            </NavLink>
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
