// app/middleware/auth.js
import { getSession } from "../utils/session";

export async function requiredRole(request, allowedRoles) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!allowedRoles.includes(session.get("role"))) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return session;
}
