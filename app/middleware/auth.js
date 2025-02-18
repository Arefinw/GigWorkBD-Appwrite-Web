// app/middleware/auth.js
import { redirect } from "@remix-run/node";
import { getSession } from "../utils/session";

export async function checkAuth({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (
    !session.get("secret") ||
    !session.get("userId") ||
    !session.get("role")
  ) {
    return redirect("/login");
  }
  return true;
}
