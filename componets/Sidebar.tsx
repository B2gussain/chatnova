"use client";

import React from "react";
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

interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

const Sidebar = ({ isOpen, onClose, isMobile }: SidebarProps) => {
    return (
        <aside
            className={`
      h-dvh bg-[#111111] border-r border-[#222] inline-flex flex-col justify-between p-4
      ${
          isMobile
              ? "fixed left-0 top-0 z-50 w-64"
              : "fixed left-0 top-0 z-40 w-64"
      }
      transition-transform duration-300
      ${!isOpen ? "-translate-x-full" : "translate-x-0"}
    `}
        >
            <div className="w-full">
                <div className="flex justify-between items-center mb-6 px-2">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            width={28}
                            height={28}
                            alt="ChatNova Logo"
                            className="rounded-md"
                        />
                        <p className="font-semibold text-lg text-white">
                            ChatNova
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X size={20} />
                    </button>
                </div>
                <Link
                    href="/"
                    className="w-full bg-[#1e1e1e] hover:bg-[#222] text-white rounded-lg flex items-center justify-start gap-2 p-2 mb-4 transition"
                >
                    <Plus size={18} />
                    <span>New Chat</span>
                </Link>
                <div className="text-gray-400 text-sm mb-2">Recent</div>
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[65vh] scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
                    {[
                        "AI Assistant",
                        "Marketing Plan",
                        "Code Debug",
                        "Daily Ideas",
                    ].map((item, i) => (
                        <button
                            key={i}
                            className="flex items-center gap-2 p-2 px-3 rounded-lg hover:bg-[#222] text-gray-300 transition"
                        >
                            <MessageSquare size={16} />
                            <span className="truncate">{item}</span>
                        </button>
                    ))}
                </div>
            </div>
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
                <Link
                    href="/auth"
                    className="flex items-center gap-2 p-2 px-3 justify-between rounded-lg hover:bg-[#222] text-gray-300 transition"
                >
                    <div className="flex items-center">
                        <CircleUserRound size={16} />
                        <h3>Guest</h3>
                    </div>
                    <span className="bg-muted py-1 px-3 rounded-full text-sm">
                        SignIn
                    </span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
