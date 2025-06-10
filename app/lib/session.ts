import { createCookieSessionStorage } from "react-router";
interface AuthSessionStorage {
  jwt: string;
}
export const authCookieStorage = createCookieSessionStorage<AuthSessionStorage>(
  {
    cookie: {
      name: "jwt_session",
      sameSite: "lax", // CSRF protection is advised if changing to 'none'
      path: "/",
      httpOnly: true,
      secrets: ["SECRET_USE_ENV"],
      secure: process.env.NODE_ENV === "production",
    },
  }
);
