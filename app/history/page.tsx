"use client";

import Sidebar from "@/componets/Sidebar";
import { Menu, MessageSquare, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatItem {
  _id: string;
  messages: Message[];
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

  useEffect(() => {
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
          className={`${isMobile ? "fixed inset-0 z-40" : "fixed inset-y-0 left-0 z-40"
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
          <div className="bg-[#141414]  rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-300 mb-3">
                Are you sure you want to delete this chat?
                To clear any memories from this chat, visit your <Link href="/setting">settings.</Link>
              </p>


            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteDialog}
                disabled={deletingId !== null}
                className=" p-1 text-white rounded-lg cursor-pointer  transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className=" p-1 text-red-700  flex items-center gap-2 cursor-pointer  rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-bold  text-lg "
              >
                {deletingId ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-red-700 rounded-full" />
                    Deleting...
                  </>
                ) : (
                  <>

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
        className={`flex-1 h-dvh w-full flex flex-col pt-16 sm:pt-20 items-center bg-background transition-all duration-300 px-4 sm:px-6 ${!isMobile && isSidebarOpen ? "md:ml-64" : ""
          }`}
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
          Chat History
        </h1>

        <div className="flex flex-col w-full max-w-3xl gap-2 overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent pb-4">
          {loading ? (
            <div className="flex flex-col gap-3 text-sm text-center mt-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full h-16  bg-muted rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
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
                <div className="flex items-center relative  gap-3 flex-1 min-w-0">
                  <MessageSquare
                    className="text-primary flex-shrink-0 mt-1"
                    size={20}
                  />
                  <span className="truncate text-sm sm:text-base font-medium line-clamp-2">
                    {item.messages?.[0]?.content || "Untitled Chat"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openDeleteDialog(item);
                    }}
                    className="text-red-600 absolute right-2 cursor-pointer hover:text-red-500 hover:bg-red-950/30 p-2 rounded-md transition flex-shrink-0"
                    title="Delete chat"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Right side - Date  */}
                <div className=" flex justify-end">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
                    <span className="whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
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