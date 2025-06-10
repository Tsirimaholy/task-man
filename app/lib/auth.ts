import { href, redirect } from "react-router";
import { authCookieStorage } from "./session";

export async function genJwt(user: { email: string; password: string }) {
  return { name: "john", password: "password" };
}
export const verifyUserPassword = async (email: string, password: string) => {
  console.log(email);
  console.log(password);
  if (email === "john@gmail.com" && password === "password") {
    return true;
  }
  return false;
};

export async function isAuthenticated(request: Request) {
  const session = await authCookieStorage.getSession(
    request.headers.get("cookie")
  );
  if (session.get("jwt")) {
    return true;
  }
  return false;
}
export async function requireIsAuthenticated(request: Request) {
  if (!(await isAuthenticated(request))) throw Error("Forbidden");
}
export async function logout(request: Request){
  const session = await authCookieStorage.getSession(request.headers.get("cookie"));
  return redirect(href("/login"), {headers: {
    "set-cookie": await authCookieStorage.destroySession(session)
  }})
}
