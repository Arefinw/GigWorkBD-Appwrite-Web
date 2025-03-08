// app/routes/messages+/$id.jsx
import { Form, useLoaderData } from "@remix-run/react";
import { ChatWindow } from "../../components/ChatWindow";
export async function loader({ request, params }) {
  const { json, redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../utils/session");
  const { getClientUser } = await import("../../middleware/database");
  const { createClient, ID, Query, Permission, Role } = await import(
    "../../utils/client/appwrite"
  );
  const { DATABASE_ID, MESSAGE_COLLECTION, CONVERSATION_COLLECTION } =
    await import("../../utils/config");
  const session = await getSession(request.headers.get("Cookie"));
  const sessionSecret = session.get("secret");
  const userId = session.get("userId");
  // console.log("userId", userId);

  if (!sessionSecret || !userId) {
    return redirect("/login");
  }

  try {
    const { databases } = await createClient(sessionSecret);
    const conversation = await databases.getDocument(
      DATABASE_ID,
      CONVERSATION_COLLECTION,
      params.id
    );

    const user = await getClientUser(userId, sessionSecret);

    // Verify participant
    if (
      ![conversation.clientId, conversation.freelancerId].includes(user.$id)
    ) {
      return redirect("/messages");
    }

    return json({
      conversationId: params.id,
      currentUserId: userId,
      receiverId:
        conversation.clientId === userId
          ? conversation.freelancerId
          : conversation.clientId,
      sessionSecret,
    });
  } catch (error) {
    console.error("Error loading conversation:", error);
    return redirect("/messages");
  }
}

export async function action({ request, params }) {
  const { json, redirect } = await import("@remix-run/node");
  const { createClient, ID, Query, Permission, Role } = await import(
    "../../utils/client/appwrite"
  );
  const { getSession } = await import("../../utils/session");
  const { DATABASE_ID, MESSAGE_COLLECTION, CONVERSATION_COLLECTION } =
    await import("../../utils/config");
  const session = await getSession(request.headers.get("Cookie"));
  const sessionSecret = session.get("secret");
  const userId = session.get("userId");

  if (!sessionSecret || !userId) {
    return redirect("/login");
  }

  const formData = await request.formData();
  const messageText = formData.get("content");

  try {
    const { databases } = await createClient(sessionSecret);

    // Verify conversation access
    const conversation = await databases.getDocument(
      DATABASE_ID,
      CONVERSATION_COLLECTION,
      params.id
    );

    if (![conversation.clientId, conversation.freelancerId].includes(userId)) {
      return json({ error: "Unauthorized" }, { status: 403 });
    }

    // Create new message
    await databases.createDocument(
      DATABASE_ID,
      MESSAGE_COLLECTION,
      ID.unique(),
      {
        conversationId: params.id,
        senderId: userId,
        text: messageText,
        isRead: false,
        status: "sent",
      },
      [
        Permission.read(Role.user(userId)),
        Permission.read(
          Role.user(
            conversation.clientId === userId
              ? conversation.freelancerId
              : conversation.clientId
          )
        ),
        Permission.update(Role.user(userId)),
      ]
    );

    // Update conversation last message
    await databases.updateDocument(
      DATABASE_ID,
      CONVERSATION_COLLECTION,
      params.id,
      { lastMessage: messageText }
    );

    return json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    return json({ error: "Failed to send message" }, { status: 500 });
  }
}

export default function ConversationRoute() {
  const { conversationId, currentUserId, receiverId, sessionSecret } =
    useLoaderData();

  return (
    <ChatWindow
      conversationId={conversationId}
      currentUserId={currentUserId}
      receiverId={receiverId}
      sessionSecret={sessionSecret}
    />
  );
}
