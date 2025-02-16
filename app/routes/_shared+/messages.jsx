import { useLoaderData } from "@remix-run/react";
import {
  UserCircleIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

export async function loader() {
  // Mock data - replace with real API calls
  return {
    conversations: [
      {
        id: 1,
        user: {
          name: "John Doe",
          avatar: "",
          online: true,
        },
        lastMessage: "Hey, I've sent the latest design files",
        timestamp: "2024-05-20T14:30:00",
        unread: 2,
      },
      {
        id: 2,
        user: {
          name: "Tech Solutions BD",
          avatar: "",
          online: false,
        },
        lastMessage: "Project deadline reminder",
        timestamp: "2024-05-20T12:45:00",
        unread: 0,
      },
    ],
    messages: [
      {
        id: 1,
        text: "Hey, I've sent the latest design files",
        sender: "John Doe",
        timestamp: "2024-05-20T14:30:00",
        status: "delivered",
      },
      {
        id: 2,
        text: "Thanks! I'll review them today",
        sender: "me",
        timestamp: "2024-05-20T14:32:00",
        status: "read",
      },
    ],
  };
}

export default function Messages() {
  const { conversations, messages } = useLoaderData();
  const activeConversation = conversations[0];

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
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                activeConversation.id === conversation.id ? "bg-emerald-50" : ""
              }`}
            >
              <div className="relative">
                <UserCircleIcon className="h-12 w-12 text-gray-400" />
                {conversation.user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{conversation.user.name}</h3>
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
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          <button className="md:hidden mr-4">
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center">
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
            <div className="ml-4">
              <h3 className="font-medium">{activeConversation.user.name}</h3>
              <p className="text-sm text-gray-500">
                {activeConversation.user.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "me" ? "justify-end" : ""}`}
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
    </div>
  );
}
