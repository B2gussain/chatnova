"use client";

import Sidebar from "@/componets/Sidebar";
import TypingLoader from "@/componets/TypingLoader";
import axios from "axios";
import { Check, Copy, Menu } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";

// ✅ Define TypeScript interfaces
interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ChatResponse {
    messages: Message[];
    createdAt: string;
}

const Page: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [copiedText, setCopiedText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [typingLoader, setTypingLoader] = useState(false);
    const [createdAt, setCreatedAt] = useState<string>("");

    // ✅ Fetch chat messages
    useEffect(() => {
        if (!id) return;

        const fetchChats = async () => {
            try {
                const res = await axios.get<ChatResponse>(`/api/allhistory/${id}`);
                console.log(res.data);

                setMessages(res.data.messages || []);
                setCreatedAt(res.data.createdAt || "");
            } catch (err) {
                console.error("Failed to fetch chat:", err);
                setError("Unable to load chat history.");
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [id]);

    // ✅ Responsive sidebar handling
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ Copy handler
    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
            setTimeout(() => setCopiedText(""), 1500);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    return (
        <div className="flex h-dvh overflow-hidden">
            {/* === Expand Button === */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 flex items-center bg-background border border-white text-white px-2 py-2 sm:px-3 rounded-full shadow-md hover:scale-105 transition"
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

            {/* === Sidebar + Overlay === */}
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

            {/* === Main Content === */}
            <main
                className={`flex-1 h-dvh flex flex-col justify-start items-center bg-background transition-all duration-300 overflow-hidden ${
                    !isMobile && isSidebarOpen ? "md:ml-64" : ""
                }`}
            >
                {/* Header Section */}
                <div className="w-full flex flex-col items-center pt-4 sm:pt-6 pb-3 px-4 sm:px-6">
                    <p className="text-base sm:text-lg text-gray-300 mb-2 sm:mb-4">
                        Previous Chat
                    </p>
                    {!loading ? (
                        <p className="bg-[#161515] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm text-center">
                            {new Date(createdAt).toLocaleString()}
                        </p>
                    ) : (
                        <div className="bg-muted/50 animate-pulse w-[160px] sm:w-[200px] h-8 sm:h-10 rounded-full"></div>
                    )}
                </div>

                {/* Messages Section */}
                <div className="flex-1 w-full overflow-y-auto px-3 sm:px-6 md:px-8 lg:px-12">
                    {!loading ? (
                        <div className="font-semibold text-white w-full max-w-4xl mx-auto flex flex-col gap-3 sm:gap-4 pb-20 sm:pb-24">
                            {messages.map((message, index) => (
                                <div className="flex flex-col" key={index}>
                                    {message.role === "user" ? (
                                        <p className="bg-primary text-white self-end rounded-2xl sm:rounded-3xl px-3 py-2 sm:px-4 sm:py-2.5 max-w-[85%] sm:max-w-[80%] text-right break-words text-sm sm:text-base">
                                            {message.content}
                                        </p>
                                    ) : (
                                        <div className="bg-muted/0 text-white self-start rounded-lg px-2 sm:px-3 py-2 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] text-left prose prose-invert prose-sm sm:prose-base relative mb-8 sm:mb-6">
                                            <button
                                                onClick={() => handleCopy(message.content)}
                                                className="absolute -bottom-6 sm:-bottom-5 left-0 transition p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs sm:text-sm"
                                            >
                                                {copiedText === message.content ? (
                                                    <p className="flex gap-1 items-center px-1.5 sm:px-2">
                                                        <Check size={12} className="text-green-400 sm:w-3.5 sm:h-3.5" />
                                                        <span className="hidden xs:inline">Copied</span>
                                                    </p>
                                                ) : (
                                                    <p className="flex gap-1 items-center px-1.5 sm:px-2">
                                                        <Copy size={12} className="text-gray-400 sm:w-3.5 sm:h-3.5" />
                                                        <span className="hidden xs:inline">Copy</span>
                                                    </p>
                                                )}
                                            </button>

                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code({ inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || "");
                                                        const codeContent = String(children).replace(/\n$/, "");

                                                        return !inline && match ? (
                                                            <div className="relative group/code my-2">
                                                                <button
                                                                    onClick={() => handleCopy(codeContent)}
                                                                    className="absolute top-2 right-2 transition p-1 rounded-md bg-background hover:bg-zinc-700 text-xs sm:text-sm z-10"
                                                                >
                                                                    {copiedText === codeContent ? (
                                                                        <p className="flex items-center px-1.5 sm:px-2">
                                                                            <Check size={12} className="text-green-400 sm:w-3.5 sm:h-3.5" />
                                                                            <span className="ml-1 hidden xs:inline">Copied</span>
                                                                        </p>
                                                                    ) : (
                                                                        <p className="flex items-center px-1.5 sm:px-2">
                                                                            <Copy size={12} className="text-gray-400 sm:w-3.5 sm:h-3.5" />
                                                                            <span className="ml-1 hidden xs:inline">Copy</span>
                                                                        </p>
                                                                    )}
                                                                </button>

                                                                <SyntaxHighlighter
                                                                    style={dracula}
                                                                    language={match[1]}
                                                                    PreTag="div"
                                                                    customStyle={{
                                                                        background: "#0c0c0cff",
                                                                        borderRadius: "0.5rem",
                                                                        padding: "0.75rem",
                                                                        fontSize: "0.8rem",
                                                                        overflowX: "auto",
                                                                    }}
                                                                    className="text-xs sm:text-sm"
                                                                    {...props}
                                                                >
                                                                    {codeContent}
                                                                </SyntaxHighlighter>
                                                            </div>
                                                        ) : (
                                                            <code
                                                                className="bg-[#1d1c1c] text-[#f8f8f2] px-1 py-0.5 rounded text-xs sm:text-sm"
                                                                {...props}
                                                            >
                                                                {children}
                                                            </code>
                                                        );
                                                    },
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* ✅ Typing loader */}
                            {typingLoader && (
                                <div className="self-start">
                                    <TypingLoader />
                                </div>
                            )}

                            {error && (
                                <p className="text-red-500 text-center text-sm sm:text-base">
                                    {error}
                                </p>
                            )}
                        </div>
                    ) : (
                        // ✅ Skeleton Loader
                        <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 sm:gap-4 animate-pulse">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-2 sm:gap-3">
                                    <div className="w-[180px] sm:w-[250px] h-8 sm:h-10 bg-muted rounded-2xl self-start"></div>
                                    <div className="w-[140px] sm:w-[200px] h-8 sm:h-10 bg-primary rounded-2xl self-end"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Button */}
                <div className="w-full flex justify-center py-4 sm:py-6 px-4 bg-background border-t border-zinc-800">
                    <Link
                        href="/"
                        className="px-4 py-2 sm:px-6 sm:py-2.5 bg-muted rounded-2xl hover:bg-muted/80 transition text-sm sm:text-base"
                    >
                        New Chat
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Page;