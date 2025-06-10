import type { User } from "generated/prisma";
import { href, redirect } from "react-router";
import { authCookieStorage } from "./session";
import prisma from "~/lib/prisma";

export async function genJwt(user: User) {
  // TODO: use a real auth strategy
  return JSON.stringify(user);
}
export const verifyUserPassword = async (email: string, password: string) => {
  // TODO: password should be encrypted
  const user = await prisma.user.findUnique({
    where: {
      email,
      password,
    },
  });
  return user;
};

export async function isAuthenticated(request: Request) {
  const session = await authCookieStorage.getSession(
    request.headers.get("cookie")
  );
  return !!session.get("jwt");
}

export async function requireIsAuthenticated(request: Request) {
  const isAuthentic = await isAuthenticated(request);
  const session = await authCookieStorage.getSession(
    request.headers.get("cookie")
  );
  if (!isAuthentic) {
    throw redirect(href("/login"), {
      headers: {
        "set-cookie": await authCookieStorage.destroySession(session),
      },
    });
  }
}

export async function logout(request: Request) {
  const session = await authCookieStorage.getSession(
    request.headers.get("cookie")
  );
  throw redirect(href("/login"), {
    headers: {
      "set-cookie": await authCookieStorage.destroySession(session),
    },
  });
}
