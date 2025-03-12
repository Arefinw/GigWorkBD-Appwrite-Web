import { Outlet, useLoaderData } from "@remix-run/react";
import { ChatList } from "../../components/ChatList";

export async function loader({ request }) {
  const { redirect } = await import("@remix-run/node");
  const { Cookie } = await import("js-cookie");
  const { getSession } = await import("../../utils/session");
  const { createAdminClient, Query } = await import("../../utils/appwrite");
  const { getUser } = await import("../../middleware/database");
  const { DATABASE_ID, USER_COLLECTION, CONVERSATION_COLLECTION } =
    await import("../../utils/config");

  try {
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    const secret = session.get("secret");

    if (!userId || !secret) {
      return redirect("/login");
    }

    const user = await getUser(userId);

    const userID = user.$id;

    return {
      currentUserId: userID,
      session: secret,
    };
  } catch (error) {
    console.log("Error loader function", error);
    return true;
  }
}

export default function MessageLayout() {
  const { currentUserId, session } = useLoaderData();
  try {
    return (
      <div className="flex h-screen">
        {/* Sidebar Chat List */}
        <div className="w-1/3 bg-gray-100 p-4 border-r">
          <ChatList currentUserId={currentUserId} session={session} />
        </div>

        {/* Chat Window or Other Content */}
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    );
  } catch (error) {
    console.log("error useLoaderData", error);
    return;
  }
}
