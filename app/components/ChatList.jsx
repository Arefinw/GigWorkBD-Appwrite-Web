import React, { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { createClient, Query } from "../utils/client/appwrite";
import {
  DATABASE_ID,
  USER_COLLECTION,
  CONVERSATION_COLLECTION,
} from "../utils/client/appwrite";
import {
  UserCircleIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export function ChatList({ currentUserId, session }) {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [databases, setDatabases] = useState(null);
  const [error, setError] = useState(null);

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    let unsubscribe;
    const initializeAppwrite = async () => {
      // Only run in browser environment

      try {
        const { client, databases } = await createClient(session);
        setClient(client);
        setDatabases(databases);
        console.log(client);
        console.log(databases);
        // Fetch conversations
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
        console.log("response", response.documents);

        // Enhance conversations with participant data
        const enhanceConversation = async (conversation) => {
          try {
            const otherId =
              conversation.clientId === currentUserId
                ? conversation.freelancerId
                : conversation.clientId;
            const participant = await databases.getDocument(
              DATABASE_ID,
              USER_COLLECTION,
              otherId
            );
            return { ...conversation, participant };
          } catch (error) {
            console.error("Error enhancing conversation:", error);
            return conversation;
          }
        };

        const enhanced = await Promise.all(
          response.documents.map((conv) => enhanceConversation(conv))
        );
        setConversations(enhanced);

        // Setup realtime subscription
        unsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${CONVERSATION_COLLECTION}.documents`,
          (response) => {
            // Handle realtime updates
            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.create"
              )
            ) {
              enhanceConversation(response.payload).then((enhancedConv) => {
                setConversations((prev) => [enhancedConv, ...prev]);
              });
            }
            if (
              response.events.includes(
                "databases.*.collections.*.documents.*.update"
              )
            ) {
              console.log(response.payload);
              enhanceConversation(response.payload).then((enhancedConv) => {
                setConversations((prev) => [
                  enhancedConv,
                  ...prev.filter((conv) => conv.$id !== enhancedConv.$id),
                ]);
              });
            }
          }
        );

        setLoading(false);
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log("error", error);
        setError(error.message);
        setLoading(false);
      }
    };

    initializeAppwrite();
  }, [session, currentUserId]);

  if (loading)
    return (
      <div className="p-4 text-emerald-500 flex items-center justify-center h-full">
        <ClockIcon className="h-8 w-8 animate-pulse" />
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-red-500 text-center">
        <CheckCircleIcon className="h-6 w-6 inline-block mr-2" />
        Error loading conversations: {error}
      </div>
    );

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-emerald-100 p-4">
        <h2 className="text-xl font-semibold text-emerald-600">
          <UserCircleIcon className="h-6 w-6 inline-block mr-2" />
          Messages
        </h2>
      </div>

      {conversations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <CheckCircleIcon className="h-12 w-12 text-emerald-100 mx-auto mb-4" />
          No conversations found
        </div>
      ) : (
        <div className="divide-y divide-emerald-50">
          {conversations.map((conversation) => (
            <Link
              key={conversation.$id}
              to={`/messages/${conversation.$id}`}
              className="block p-4 hover:bg-emerald-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <UserCircleIcon className="h-12 w-12 text-emerald-300" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-emerald-900 truncate">
                      {conversation.participant?.fullName || "Unknown User"}
                    </h3>
                    <span className="text-xs text-emerald-500">
                      {new Date(conversation.$updatedAt).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-emerald-600 truncate">
                      {conversation.lastMessage || "New conversation"}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-emerald-500 text-white rounded-full px-2 py-1 text-xs">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
