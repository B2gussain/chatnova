"use client";

import React, { useEffect } from "react";
import {
  Plus,
  History,
  Settings,
  X,
  MessageSquare,
  CircleUserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  onNewChat?: () => void; // ✅ Added this prop
}

const Sidebar = ({ isOpen, onClose, isMobile, onNewChat }: SidebarProps) => {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const fetch_history = async () => {
      try {
        const res = await axios.get("/api/allhistory", {
          params: { email: user?.primaryEmailAddress?.emailAddress },
        });
        console.log(res.data.chats);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    if (isLoaded && isSignedIn && user) {
      fetch_history();
    }
  }, [isLoaded, isSignedIn, user]); // ✅ fixed dependency array

  return (
    <aside
      className={`
        h-dvh bg-[#111111] border-r border-[#222] flex flex-col justify-between p-4
        ${isMobile ? "fixed left-0 top-0 z-50 w-64" : "fixed left-0 top-0 z-40 w-64"}
        transition-transform duration-300
        ${!isOpen ? "-translate-x-full" : "translate-x-0"}
      `}
    >
      {/* Top Section */}
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" width={28} height={28} alt="ChatNova Logo" />
            <p className="font-semibold text-lg text-white">ChatNova</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* ✅ New Chat Button */}
        <button
          onClick={() => {
            onNewChat?.();
            if (isMobile) onClose?.();
          }}
          className="w-full bg-[#1e1e1e] hover:bg-[#222] text-white rounded-lg flex items-center gap-2 p-2 mb-4 transition"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>

        {/* Recent Chats */}
        <div className="text-gray-400 text-sm mb-2">Recent</div>
        <div className="flex flex-col gap-1 overflow-y-auto max-h-[65vh] scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
          {["AI Assistant", "Marketing Plan", "Code Debug", "Daily Ideas"].map(
            (item, i) => (
              <button
                key={i}
                className="flex items-center gap-2 p-2 px-3 rounded-lg hover:bg-[#222] text-gray-300 transition"
              >
                <MessageSquare size={16} />
                <span className="truncate">{item}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2 border-t border-[#222] pt-3">
        <Link
          href="/history"
          className="flex items-center gap-2 p-2 px-3 rounded-lg hover:bg-[#222] text-gray-300 transition"
        >
          <History size={16} />
          <span>History</span>
        </Link>

        <Link
          href="/setting"
          className="flex items-center gap-2 p-2 px-3 rounded-lg hover:bg-[#222] text-gray-300 transition"
        >
          <Settings size={16} />
          <span>Settings</span>
        </Link>

        {/* ✅ User Section */}
        {isLoaded && isSignedIn && user ? (
          <div className="flex items-center gap-2 pl-2">
            <img
              src={user.imageUrl}
              alt="User Avatar"
              width={30}
              height={30}
              className="rounded-full"
            />
            <div>
              <p className="text-white font-semibold">
                {user.firstName || "User"}
              </p>
              <p className="text-gray-400 text-sm">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        ) : (
          <Link
            href="/auth"
            className="flex items-center gap-2 p-2 px-3 justify-between rounded-lg hover:bg-[#222] text-gray-300 transition"
          >
            <div className="flex items-center gap-2">
              <CircleUserRound size={16} />
              <h3>Guest</h3>
            </div>
            <span className="bg-muted py-1 px-3 rounded-full text-sm">
              Sign In
            </span>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
