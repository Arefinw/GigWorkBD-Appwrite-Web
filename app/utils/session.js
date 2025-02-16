// app/utils/session.js
import { createCookieSessionStorage } from "@remix-run/node";
import { SESSION_SECRET } from "./config";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      secrets: [SESSION_SECRET],
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    },
  });

export { getSession, commitSession, destroySession };
