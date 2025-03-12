import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { createClient } from "../utils/client/appwrite";
import {
  UserCircleIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { DATABASE_ID, MESSAGE_COLLECTION } from "../utils/client/appwrite";

export function ChatWindow({
  conversation,
  initialMessages,
  currentUserId,
  sessionSecret,
}) {
  const fetcher = useFetcher();
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const initializeRealtime = async () => {
      const { client } = await createClient(sessionSecret);
      setClient(client);
      const unsubscribe = client.subscribe(
        `databases.${DATABASE_ID}.collections.${MESSAGE_COLLECTION}.documents`,
        (response) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            console.log(response.payload);
            setMessages((prev) => [...prev, response.payload]);
          }
        }
      );

      return () => unsubscribe();
    };

    initializeRealtime();
  }, [sessionSecret]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-emerald-100 p-4 bg-white">
        <div className="flex items-center">
          <UserCircleIcon className="h-10 w-10 text-emerald-300 mr-4" />
          <div>
            <h2 className="font-semibold text-emerald-600">
              {conversation.participant?.fullName || "Participant"}
            </h2>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-emerald-50">
        {messages.map((message) => (
          <MessageBubble
            key={message.$id}
            message={message}
            isCurrentUser={message.senderId === currentUserId}
          />
        ))}
      </div>

      {/* Message Input */}
      <fetcher.Form
        method="post"
        className="border-t border-emerald-100 p-4 bg-white"
      >
        <div className="flex items-center space-x-4">
          <input
            type="text"
            name="message"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-emerald-200 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
          <SubmitButton state={fetcher.state} />
        </div>
      </fetcher.Form>
    </div>
  );
}

function MessageBubble({ message, isCurrentUser }) {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md p-4 rounded-2xl ${
          isCurrentUser
            ? "bg-emerald-500 text-white"
            : "bg-white border border-emerald-100"
        }`}
      >
        <p>{message.content}</p>
        <MessageMeta message={message} isCurrentUser={isCurrentUser} />
      </div>
    </div>
  );
}

function MessageMeta({ message, isCurrentUser }) {
  return (
    <div className="flex items-center justify-end mt-2 space-x-2">
      <span className="text-xs opacity-75">
        {new Date(message.$createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      {isCurrentUser && (
        <CheckCircleIcon
          className={`h-4 w-4 ${
            message.status === "read" ? "text-emerald-300" : "text-emerald-100"
          }`}
        />
      )}
    </div>
  );
}

function SubmitButton({ state }) {
  return (
    <button
      type="submit"
      disabled={state === "submitting"}
      className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:opacity-50"
    >
      {state === "submitting" ? (
        <ClockIcon className="h-6 w-6 animate-pulse" />
      ) : (
        <PaperAirplaneIcon className="h-6 w-6 rotate-45" />
      )}
    </button>
  );
}
