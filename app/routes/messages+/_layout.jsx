// app/routes/messages+/_layout.jsx
import { Outlet, useLoaderData } from "@remix-run/react";
import { ChatList } from "../../components/ChatList";

export async function loader({ request }) {
  const { redirect, json } = await import("@remix-run/node");
  const { getSession } = await import("../../utils/session");
  const { getClientUser } = await import("../../middleware/database");

  const session = await getSession(request.headers.get("Cookie"));

  if (!session.get("secret") || !session.get("userId")) {
    return redirect("/login");
  }

  try {
    const user = await getClientUser(
      session.get("userId"),
      session.get("secret")
    );
    const userId = user.$id;

    return json({
      currentUserId: userId,
      sessionSecret: session.get("secret"),
    });
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to load conversations" }, { status: 500 });
  }
}

export default function MessagesLayout() {
  const { currentUserId, sessionSecret } = useLoaderData();

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white rounded-xl shadow-lg">
      <ChatList currentUserId={currentUserId} sessionSecret={sessionSecret} />

      <Outlet />
    </div>
  );
}
