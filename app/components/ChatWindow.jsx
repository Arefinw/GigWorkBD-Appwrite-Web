// app/components/ChatWindow.jsx
import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { createClient, Query } from "../utils/client/appwrite";
import { DATABASE_ID, MESSAGE_COLLECTION } from "../utils/client/appwrite";

export function ChatWindow({
  conversationId,
  currentUserId,
  receiverId,
  sessionSecret,
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const fetcher = useFetcher();

  useEffect(() => {
    let isMounted = true;
    let unsubscribe;

    const initializeChat = async () => {
      try {
        if (!sessionSecret) {
          throw new Error("Authentication required");
        }

        // Create authenticated client
        const { databases, client } = await createClient(sessionSecret);

        // Load initial messages
        const response = await databases.listDocuments(
          DATABASE_ID,
          MESSAGE_COLLECTION,
          [
            Query.equal("conversationId", conversationId),
            Query.orderAsc("$createdAt"),
          ]
        );

        if (isMounted) {
          setMessages(response.documents);
          setLoading(false);
        }

        // Setup realtime subscription
        unsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${MESSAGE_COLLECTION}.documents`,
          (response) => {
            if (
              isMounted &&
              response.payload.conversationId === conversationId
            ) {
              handleRealtimeUpdate(response);
            }
          }
        );

        setSubscription(unsubscribe);
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setLoading(false);
          console.error("ChatWindow error:", error);
        }
      }
    };

    const handleRealtimeUpdate = (response) => {
      if (
        response.events.includes("databases.*.collections.*.documents.*.create")
      ) {
        setMessages((prev) => [...prev, response.payload]);
      }

      if (
        response.events.includes("databases.*.collections.*.documents.*.update")
      ) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.$id === response.payload.$id ? response.payload : msg
          )
        );
      }

      if (
        response.events.includes("databases.*.collections.*.documents.*.delete")
      ) {
        setMessages((prev) =>
          prev.filter((msg) => msg.$id !== response.payload.$id)
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
  }, [conversationId, sessionSecret]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Error loading messages: {error}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <MessageBubble
            key={message.$id}
            message={message}
            isCurrentUser={message.senderId === currentUserId}
          />
        ))}
      </div>

      <fetcher.Form
        method="post"
        className="p-4 border-t bg-white"
        onSubmit={() => {
          if (fetcher.state === "submitting") {
            const form = document.getElementById("message-form");
            form?.reset();
          }
        }}
      >
        <input type="hidden" name="conversationId" value={conversationId} />
        <input type="hidden" name="receiverId" value={receiverId} />
        <div className="flex gap-2">
          <input
            type="text"
            name="content"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={fetcher.state === "submitting"}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
            disabled={fetcher.state === "submitting"}
          >
            {fetcher.state === "submitting" ? "Sending..." : "Send"}
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}

const MessageBubble = ({ message, isCurrentUser }) => (
  <div className={`mb-4 ${isCurrentUser ? "text-right" : "text-left"}`}>
    <div
      className={`inline-block p-3 rounded-lg max-w-[80%] ${
        isCurrentUser ? "bg-blue-500 text-white" : "bg-white border"
      }`}
    >
      <p className="break-words">{message.text}</p>
      <div
        className={`mt-1 text-xs ${
          isCurrentUser ? "text-blue-100" : "text-gray-500"
        }`}
      >
        {new Date(message.$createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
        <span className="ml-2">
          {message.status === "read" && "✓✓"}
          {message.status === "delivered" && "✓"}
        </span>
      </div>
    </div>
  </div>
);
