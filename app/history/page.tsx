"use client";

import Sidebar from "@/componets/Sidebar";
import { Calendar, Menu, MessageSquare, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

interface ChatItem {
  _id: string;
  messages: any;
  createdAt: string;
}

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<ChatItem | null>(null);

  const fetchHistory = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      setLoading(true);
      const res = await axios.get("/api/allhistory", {
        params: { email: user.primaryEmailAddress.emailAddress },
      });

      const chats = res.data.chats || [];
      setChatHistory(chats.reverse());
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchHistory();
    }
  }, [isLoaded, isSignedIn, user]);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Format date to show only date (no time)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (chat: ChatItem) => {
    setChatToDelete(chat);
    setShowDeleteDialog(true);
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setChatToDelete(null);
  };

  // Delete chat history
  const confirmDelete = async () => {
    if (!chatToDelete) return;

    try {
      setDeletingId(chatToDelete._id);
      await axios.delete(`/api/allhistory/${chatToDelete._id}`);

      // Remove from local state immediately for better UX
      setChatHistory((prev) => prev.filter((chat) => chat._id !== chatToDelete._id));
      closeDeleteDialog();
    } catch (err) {
      console.error("Error deleting chat:", err);
      alert("Failed to delete chat. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex h-dvh overflow-x-hidden">
      {/* Expand Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-3 left-3 sm:top-4 sm:left-4 cursor-pointer z-50 bg-background border border-white flex justify-center items-center text-white px-2 py-2 sm:px-3 rounded-full shadow-md hover:scale-105 transition"
        >
          <Image
            src="/logo.png"
            width={24}
            height={24}
            alt="ChatNova Logo"
            className="mr-1 sm:mr-2 sm:w-7 sm:h-7"
          />
          <Menu size={18} className="sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Sidebar + Overlay */}
      {isSidebarOpen && (
        <div
          className={`${
            isMobile ? "fixed inset-0 z-40" : "fixed inset-y-0 left-0 z-40"
          }`}
        >
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Trash2 className="text-red-500" size={24} />
                Delete Chat
              </h2>
              <button
                onClick={closeDeleteDialog}
                className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-300 mb-3">
                Are you sure you want to delete this chat?
              </p>
              {chatToDelete && (
                <div className="bg-[#0f0f0f] border border-[#222] rounded-lg p-3">
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {Array.isArray(chatToDelete.messages)
                      ? chatToDelete.messages[0]?.content || "Untitled Chat"
                      : typeof chatToDelete.messages === "object"
                      ? chatToDelete.messages.content || "Untitled Chat"
                      : chatToDelete.messages || "Untitled Chat"}
                  </p>
                </div>
              )}
              <p className="text-red-400 text-sm mt-3">
                This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteDialog}
                disabled={deletingId !== null}
                className="flex-1 px-4 py-2.5 bg-[#222] hover:bg-[#2a2a2a] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {deletingId ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 h-dvh w-full flex flex-col pt-16 sm:pt-20 items-center bg-background transition-all duration-300 px-4 sm:px-6 ${
          !isMobile && isSidebarOpen ? "md:ml-64" : ""
        }`}
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
          Chat History
        </h1>

        <div className="flex flex-col w-full max-w-3xl gap-2 overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent pb-4">
          {loading ? (
            <div className="flex flex-col gap-3 text-sm text-center mt-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full h-16 sm:h-20 bg-muted rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
              <MessageSquare size={48} className="text-gray-600" />
              <p className="text-gray-500 text-base sm:text-lg text-center">
                No chat history yet
              </p>
              <Link
                href="/"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
              >
                Start a New Chat
              </Link>
            </div>
          ) : (
            chatHistory.map((item) => (
              <Link
                href={`/history/${item._id}`}
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 p-3 sm:p-4 rounded-lg hover:bg-[#222] bg-muted/20 text-gray-300 transition group"
              >
                {/* Left side - Message preview */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <MessageSquare
                    className="text-primary flex-shrink-0 mt-1"
                    size={20}
                  />
                  <span className="truncate text-sm sm:text-base font-medium line-clamp-2">
                    {Array.isArray(item.messages)
                      ? item.messages[0]?.content || "Untitled Chat"
                      : typeof item.messages === "object"
                      ? item.messages.content || "Untitled Chat"
                      : item.messages || "Untitled Chat"}
                  </span>
                </div>

                {/* Right side - Date and Delete */}
                <div className="flex items-center gap-3 sm:gap-4 ml-8 sm:ml-0">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
                    <Calendar className="text-green-600" size={16} />
                    <span className="whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openDeleteDialog(item);
                    }}
                    className="text-red-600 hover:text-red-500 hover:bg-red-950/30 p-2 rounded-md transition flex-shrink-0"
                    title="Delete chat"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;