// app/root.jsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import style from "./styles/tailwind.css?url";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getSession } from "./utils/session";

export function links() {
  return [
    { rel: "stylesheet", href: style },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Material+Icons&display=swap",
    },
  ];
}

export const meta = () => {
  return [
    { charset: "utf-8" },
    { title: "GigWorkBD - Your Freelance Marketplace" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};

export async function loader({ request }) {
  // Get user session from cookies
  const session = await getSession(request.headers.get("Cookie"));
  // Return user data if authenticated
  return {
    userId: session?.get("userId") || null,
    role: session?.get("role") || null,
    isAuthenticated: !!session?.get("secret"),
  };
}

export default function App() {
  const { userId, role, isAuthenticated } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Header userId={userId} role={role} />
        <main>
          <Outlet context={{ userId, role, isAuthenticated }} />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
