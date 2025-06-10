import { useRouteLoaderData } from "react-router";
import { type loader as rootLoader } from "~/root";

export function useOptionalUser() {
  const data = useRouteLoaderData<typeof rootLoader>("root");
  if (!data || !data.user) {
    return undefined;
  }
  return data.user;
}
