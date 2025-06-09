import { Loader } from "lucide-react";
import {
    Form,
    href,
    NavLink,
    redirect,
    useActionData,
    useNavigation,
} from "react-router";
import { H6, Paragraph } from "~/components/typography";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { delay } from "~/lib/timing";
import type { Route } from "./+types/login";

export const action = async ({}: Route.ActionArgs) => {
  await delay();
  if (false) {
    return {
      success: false,
      errors: {
        globalError: "",
        email: ["Invalid email"],
        password: ["Wrong Password"],
      },
    };
  }
  return redirect(href("/"));
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
            <label
              htmlFor="email"
              className={`font-bold ${
                !!data?.errors.email.length ? "text-red-600" : ""
              }`}
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={
                !!data?.errors.email.length
                  ? "border-red-600 text-red-600 bg-red-100"
                  : ""
              }
            />
            <span className="text-red-600">
              {!!data?.errors.email.length && data?.errors.email[0]}
            </span>
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className={`font-bold ${
                !!data?.errors.email.length ? "text-red-600" : ""
              }`}
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`${
                !!data?.errors.password.length
                  ? "border-red-600 text-red-600 bg-red-100"
                  : ""
              }`}
            />
            <span className="text-red-600">
              {!!data?.errors.password.length && data?.errors.password[0]}
            </span>
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={navigation.state !== "idle"}
          >
            {navigation.state === "submitting" ? "Submitting..." : "Login"}
            {navigation.state === "submitting" && (
              <Loader className="animate-spin" />
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
