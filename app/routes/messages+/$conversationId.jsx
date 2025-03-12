// app/routes/messages+/$conversationId.jsx
import { useLoaderData } from "@remix-run/react";
import { ChatWindow } from "../../components/ChatWindow";

export async function loader({ request, params }) {
  const { getSession } = await import("../../utils/session");
  const { createAdminClient, Query } = await import("../../utils/appwrite");
  const { getUser } = await import("../../middleware/database");
  const {
    DATABASE_ID,
    USER_COLLECTION,
    CONVERSATION_COLLECTION,
    MESSAGE_COLLECTION,
  } = await import("../../utils/config");
  const session = await getSession(request.headers.get("Cookie"));
  const secret = session.get("secret");
  const userId = session.get("userId");
  console.log(userId);

  // Get User
  const user = await getUser(userId);
  const { databases } = await createAdminClient();

  try {
    const conversation = await databases.getDocument(
      DATABASE_ID,
      CONVERSATION_COLLECTION,
      params.conversationId
    );

    // Verify user is part of conversation
    if (
      conversation.clientId !== user.$id &&
      conversation.freelancerId !== user.$id
    ) {
      throw new Response("Not Found", { status: 404 });
    }

    // Get existing messages
    const messages = await databases.listDocuments(
      DATABASE_ID,
      MESSAGE_COLLECTION,
      [
        Query.equal("conversationId", params.conversationId),
        Query.orderAsc("$createdAt"),
      ]
    );

    const userID = user.$id;

    return {
      sessionSecret: secret,
      conversation,
      initialMessages: messages.documents,
      currentUserId: userID,
      participantId:
        conversation.clientId === userID
          ? conversation.freelancerId
          : conversation.clientId,
    };
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Conversation not found", { status: 404 });
  }
}

export async function action({ request, params }) {
  const { getSession } = await import("../../utils/session");
  const { createAdminClient, Permission, ID, Role } = await import(
    "../../utils/appwrite"
  );
  const { getUser } = await import("../../middleware/database");
  const {
    DATABASE_ID,
    USER_COLLECTION,
    CONVERSATION_COLLECTION,
    MESSAGE_COLLECTION,
  } = await import("../../utils/config");

  const formData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const secret = session.get("secret");
  const role = session.get("role");
  const currentUserId = session.get("userId");

  // Get User Document
  const user = await getUser(currentUserId);

  try {
    const content = formData.get("message");

    // Get database instance
    const { databases } = await createAdminClient();

    // Get conversation
    const conversation = await databases.getDocument(
      DATABASE_ID,
      CONVERSATION_COLLECTION,
      params.conversationId
    );

    const participantId =
      role === "client" ? conversation.freelancerId : conversation.clientId;

    const participant = await databases.getDocument(
      DATABASE_ID,
      USER_COLLECTION,
      participantId
    );

    // Create new message
    const message = await databases.createDocument(
      DATABASE_ID,
      MESSAGE_COLLECTION,
      ID.unique(),
      {
        conversationId: params.conversationId,
        content,
        receiverId: conversation.freelancerId,
        senderId: user.$id,
        status: "delivered",
      },
      [
        Permission.read(Role.user(currentUserId)),
        Permission.read(Role.user(participantId)),
      ]
    );

    // Update conversation timestamp
    await databases.updateDocument(
      DATABASE_ID,
      CONVERSATION_COLLECTION,
      params.conversationId,
      {
        lastMessage: content,
      },
      [
        Permission.update(Role.user(currentUserId)),
        Permission.update(Role.user(participantId)),
      ]
    );

    return { ok: true, message };
  } catch (error) {
    console.error("Action error:", error);
    return { ok: false, error: error.message };
  }
}

export default function Conversation() {
  const { conversation, initialMessages, currentUserId, sessionSecret } =
    useLoaderData();

  return (
    <ChatWindow
      conversation={conversation}
      initialMessages={initialMessages}
      currentUserId={currentUserId}
      sessionSecret={sessionSecret}
    />
  );
}
