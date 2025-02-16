import { Form, useNavigation } from "@remix-run/react";
import { useEffect } from "react";

// Server-side action to handle logout

// Client-side component
export default function Logout() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") {
      document.getElementById("logoutForm")?.submit();
    }
  }, [navigation.state]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Logging out...
          </h2>

          <Form method="post" id="logoutForm" className="mt-8 space-y-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              disabled={navigation.state !== "idle"}
            >
              {navigation.state === "submitting"
                ? "Logging out..."
                : "Click here if not redirected"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const { redirect } = await import("@remix-run/node");
  try {
    const { getSession, destroySession } = await import("../../utils/session");

    // Get the session cookie
    const session = await getSession(request.headers.get("Cookie"));

    if (!session) {
      return redirect("/");
    }

    // Redirect to home page after logout
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return redirect("/");
  }
}
