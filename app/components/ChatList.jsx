// app/components/ChatList.jsx
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { createClient, Query } from "../utils/client/appwrite";
import { DATABASE_ID, CONVERSATION_COLLECTION } from "../utils/client/appwrite";

export function ChatList({ currentUserId, sessionSecret }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe;

    const initializeChat = async () => {
      try {
        if (!sessionSecret || !currentUserId) {
          throw new Error("Authentication required");
        }

        // Create authenticated client
        const { databases, client } = await createClient(sessionSecret);

        // Load initial conversations
        const response = await databases.listDocuments(
          DATABASE_ID,
          CONVERSATION_COLLECTION,
          [
            Query.or([
              Query.equal("clientId", currentUserId),
              Query.equal("freelancerId", currentUserId),
            ]),
            Query.orderDesc("$updatedAt"),
          ]
        );

        if (isMounted) {
          setConversations(response.documents);
          setLoading(false);
        }

        // Setup realtime subscription
        unsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${CONVERSATION_COLLECTION}.documents`,
          (response) => {
            if (isMounted) {
              handleRealtimeUpdate(response);
            }
          }
        );

        setSubscription(unsubscribe);
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setLoading(false);
          console.error("ChatList error:", error);
        }
      }
    };

    const handleRealtimeUpdate = (response) => {
      if (
        response.events.includes("databases.*.collections.*.documents.*.update")
      ) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.$id === response.payload.$id ? response.payload : conv
          )
        );
      }

      // Handle new conversation creation
      if (
        response.events.includes("databases.*.collections.*.documents.*.create")
      ) {
        setConversations((prev) => [response.payload, ...prev]);
      }

      // Handle conversation deletion
      if (
        response.events.includes("databases.*.collections.*.documents.*.delete")
      ) {
        setConversations((prev) =>
          prev.filter((conv) => conv.$id !== response.payload.$id)
        );
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription();
      }
    };
  }, [currentUserId, sessionSecret]);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading conversations...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading conversations: {error}
      </div>
    );
  }

  if (!conversations.length) {
    return <div className="p-4 text-gray-500">No conversations found</div>;
  }

  return (
    <div className="w-96 border-r border-gray-200">
      <div className="p-4 bg-white border-b">
        <h2 className="text-xl font-semibold">Conversations</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-160px)]">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.$id}
            conversation={conv}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}

const ConversationItem = ({ conversation, currentUserId }) => (
  <Link
    to={`/messages/${conversation.$id}`}
    className="block p-4 border-b hover:bg-gray-50 transition-colors"
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-sm">
            {conversation.clientId === currentUserId ? "Freelancer" : "Client"}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(conversation.$updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {conversation.lastMessage || "No messages yet"}
        </p>
      </div>
      {/* Unread indicator */}
      {conversation.unreadCount > 0 && (
        <span className="ml-2 w-5 h-5 flex items-center justify-center bg-blue-500 text-white text-xs rounded-full">
          {conversation.unreadCount}
        </span>
      )}
    </div>
  </Link>
);
