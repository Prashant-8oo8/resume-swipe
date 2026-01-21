import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  mockChatConversations,
  mockChatMessages,
  mockCandidateProfiles,
} from "@/lib/mockData";

export default function ChatPage() {
  const navigate = useNavigate();
  const { auth, logout } = useApp();
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  if (!auth.isAuthenticated || auth.role !== "hr") {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get conversations for this HR manager
  const conversations = mockChatConversations.filter(
    (conv) => conv.hrId === auth.hrProfile?.id
  );

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  const selectedMessages = selectedConversationId
    ? mockChatMessages.filter((msg) => msg.conversationId === selectedConversationId)
    : [];

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversationId) {
      // In a real app, this would send the message to the backend
      // For now, we'll just clear the input
      setMessageText("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl w-full px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div
          className={`w-full sm:w-72 border-r border-slate-200 bg-white overflow-y-auto ${
            selectedConversationId ? "hidden sm:flex flex-col" : "flex flex-col"
          }`}
        >
          {conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <p className="text-slate-600 mb-4">No conversations yet</p>
                <Button onClick={() => navigate("/hr/dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {conversations.map((conversation) => {
                const candidate = mockCandidateProfiles.find(
                  (p) => p.id === conversation.candidateId
                );
                const isSelected = conversation.id === selectedConversationId;

                return (
                  <motion.button
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`w-full text-left px-4 py-4 transition-colors ${
                      isSelected
                        ? "bg-pink-50 border-l-4 border-pink-500"
                        : "hover:bg-slate-50"
                    }`}
                    whileHover={{ backgroundColor: isSelected ? undefined : "#f8fafc" }}
                  >
                    <h3 className="font-semibold text-slate-900">
                      {candidate?.fullName}
                    </h3>
                    <p className="text-sm text-slate-600 truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-slate-200 bg-white px-4 sm:px-6 py-4 flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversationId(null)}
                className="sm:hidden gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="font-semibold text-slate-900">
                  {
                    mockCandidateProfiles.find(
                      (p) => p.id === selectedConversation.candidateId
                    )?.fullName
                  }
                </h2>
                <p className="text-xs text-slate-600">Shortlisted candidate</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              <AnimatePresence>
                {selectedMessages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.senderRole === "hr"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.senderRole === "hr"
                          ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderRole === "hr"
                            ? "text-pink-100"
                            : "text-slate-600"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSendMessage()
                  }
                  className="h-10"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-slate-600 mb-4">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
