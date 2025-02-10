import { createSessionStorage } from "@remix-run/node";
import { SESSION_SECRET } from "./config";

const { getSession, commitSession, destroySession } = createSessionStorage({
  cookie: {
    name: "__session",
    secrets: [SESSION_SECRET],
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  },
});

export { getSession, commitSession, destroySession };
