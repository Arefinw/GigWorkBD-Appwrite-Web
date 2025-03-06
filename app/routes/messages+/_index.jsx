// app/routes/messages+/_index.jsx
import { useLoaderData, Link } from "@remix-run/react";
import {
  UserCircleIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader({ request }) {
  const { redirect } = await import("@remix-run/node");
  const { getSession } = await import("../../utils/session");
  const { getClientUser } = await import("../../middleware/database");
  const { createClient, ID, Query } = await import(
    "../../utils/client/appwrite"
  );
  const {
    DATABASE_ID,
    USER_COLLECTION,
    CONVERSATION_COLLECTION,
    MESSAGE_COLLECTION,
  } = await import("../../utils/config");

  const session = await getSession(request.headers.get("Cookie"));
  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversation");

  if (!session.get("secret") || !session.get("userId")) {
    return redirect("/login");
  }

  try {
    const { databases } = await createClient(session.get("secret"));
    const user = await getClientUser(
      session.get("userId"),
      session.get("secret")
    );
    const userId = user.$id;

    // Get conversations
    const conversations = await databases.listDocuments(
      DATABASE_ID,
      CONVERSATION_COLLECTION,
      [
        Query.or([
          Query.equal("clientId", userId),
          Query.equal("freelancerId", userId),
        ]),
      ]
    );
    console.log("conversations", conversations);

    // Enhance conversations with participant info
    const enhancedConversations = await Promise.all(
      conversations.documents.map(async (conv) => {
        const participantId =
          conv.clientId === userId ? conv.freelancerId : conv.clientId;
        console.log("participantId", participantId);
        const participant = await databases.getDocument(
          DATABASE_ID,
          USER_COLLECTION,
          participantId
        );
        // const participant = await getClientUser(
        //   participantId,
        //   session.get("secret")
        // );
        console.log("participant", participant);

        // Get unread messages count
        const unreadResult = await databases.listDocuments(
          DATABASE_ID,
          MESSAGE_COLLECTION,
          [
            Query.equal("conversationId", conv.$id),
            Query.equal("isRead", false),
            Query.notEqual("senderId", userId),
          ]
        );

        // Get last message
        const lastMessageResult = await databases.listDocuments(
          DATABASE_ID,
          MESSAGE_COLLECTION,
          [
            Query.equal("conversationId", conv.$id),
            Query.orderDesc("$createdAt"),
            Query.limit(1),
          ]
        );

        return {
          $id: conv.$id,
          participant,
          unread: unreadResult.total,
          lastMessage:
            lastMessageResult.documents[0]?.text || "No messages yet",
          timestamp:
            lastMessageResult.documents[0]?.$createdAt || conv.$createdAt,
        };
      })
    );

    console.log("enhancedConversations", enhancedConversations);

    // Find active conversation
    let activeConversation = enhancedConversations.find(
      (c) => c.$id === conversationId
    );
    if (!activeConversation && enhancedConversations.length > 0) {
      activeConversation = enhancedConversations[0];
    }

    // Get messages for active conversation
    let messages = [];
    if (activeConversation) {
      const messagesResult = await databases.listDocuments(
        DATABASE_ID,
        MESSAGE_COLLECTION,
        [
          Query.equal("conversationId", activeConversation.$id),
          Query.orderAsc("$createdAt"),
        ]
      );

      messages = messagesResult.documents.map((msg) => ({
        id: msg.$id,
        text: msg.text,
        sender:
          msg.senderId === userId
            ? "me"
            : activeConversation.participant.fullName,
        timestamp: msg.$createdAt,
        status: msg.status || "delivered",
      }));
    }

    return new Response(
      JSON.stringify({
        conversations: enhancedConversations,
        messages,
        activeConversationId: activeConversation?.$id || null,
        error: url.searchParams.get("error"),
        currentUserId: userId,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to load messages" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default function Messages() {
  const {
    conversations,
    messages,
    activeConversationId,
    error,
    currentUserId,
  } = useLoaderData();
  const activeConversation =
    conversations?.find((c) => c.$id === activeConversationId) ||
    conversations?.[0] ||
    null;

  if (error) {
    return (
      <div className="p-8 text-red-500">Error loading messages: {error}</div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white rounded-xl shadow-lg">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-96 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center">
            <UserCircleIcon className="h-6 w-6 text-emerald-600 mr-2" />
            Messages
          </h2>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-220px)]">
          {conversations?.map((conversation) => (
            <Link
              key={conversation.$id}
              to={`?conversation=${conversation.$id}`}
              className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 ${
                activeConversation?.$id === conversation.$id
                  ? "bg-emerald-50"
                  : ""
              }`}
            >
              <div className="relative">
                <UserCircleIcon className="h-12 w-12 text-gray-400" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {conversation.participant.fullName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(conversation.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <span className="bg-emerald-500 text-white rounded-full px-2 py-1 text-xs">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center">
            <button className="md:hidden mr-4">
              <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
              <div className="ml-4">
                <h3 className="font-medium">
                  {activeConversation.participant.fullName}
                </h3>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : ""
                }`}
              >
                <div
                  className={`max-w-md p-4 rounded-2xl ${
                    message.sender === "me"
                      ? "bg-emerald-500 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <p>{message.text}</p>
                  <div className="flex items-center justify-end mt-2 space-x-2">
                    <span className="text-xs opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {message.sender === "me" && (
                      <CheckCircleIcon
                        className={`h-4 w-4 ${
                          message.status === "read"
                            ? "text-blue-400"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600">
                <PaperAirplaneIcon className="h-6 w-6 rotate-45" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          {conversations?.length === 0
            ? "No conversations found"
            : "Select a conversation"}
        </div>
      )}
    </div>
  );
}
