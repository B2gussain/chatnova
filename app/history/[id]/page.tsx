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
    createdAt: string
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
    const [createdAt, setCreatedAt] = useState<string>("")
    // ✅ Fetch chat messages
    useEffect(() => {
        if (!id) return;

        const fetchChats = async () => {
            try {
                const res = await axios.get<ChatResponse>(`/api/allhistory/${id}`);
                console.log(res.data);

                setMessages(res.data.messages || []);
                setCreatedAt(res.data.createdAt || ""); // ✅ Fixed
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

    // ✅ Loading state


    return (
        <div className="flex h-dvh overflow-x-hidden">
            {/* === Expand Button === */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed top-4 left-4 z-50 flex items-center bg-background border border-white text-white px-3 py-2 rounded-full shadow-md hover:scale-105 transition"
                >
                    <Image
                        src="/logo.png"
                        width={28}
                        height={28}
                        alt="ChatNova Logo"
                        className="mr-2"
                    />
                    <Menu size={20} />
                </button>
            )}

            {/* === Sidebar + Overlay === */}
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

            {/* === Main Content === */}
            <main
                className={`flex-1 h-dvh md:px-15 lg:px-24 flex p-6 flex-col justify-center items-center bg-background transition-all duration-300 ${!isMobile && isSidebarOpen ? "md:ml-64" : ""
                    }`}
            >
                <p className="text-lg text-gray-300 mb-4">Previous Chat</p>
                {!loading?<p className="bg-[#161515] px-2 py-1 rounded-lg">{new Date(createdAt).toLocaleString()}</p>:<p className="bg-muted/50 animate-pulse w-[200px] h-10 rounded-full "></p>}
                
                {!loading ?
                    <div className="font-semibold text-white w-full max-w-4xl overflow-y-auto flex flex-col gap-4 mt-10 pb-24">
                        {messages.map((message, index) => (
                            <div className="flex flex-col" key={index}>
                                {message.role === "user" ? (
                                    <p className="bg-primary text-white self-end rounded-3xl px-3 py-2 max-w-[80%] text-right break-words">
                                        {message.content}
                                    </p>
                                ) : (
                                    <div className="bg-muted/0 text-white self-start rounded-lg px-3 py-2 max-w-[80%] text-left prose prose-invert relative">
                                        <button
                                            onClick={() => handleCopy(message.content)}
                                            className="absolute -bottom-5 left-0 transition p-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
                                        >
                                            {copiedText === message.content ? (
                                                <p className="flex gap-1 items-center text-sm px-2">
                                                    <Check size={14} className="text-green-400" /> Copied
                                                </p>
                                            ) : (
                                                <p className="flex gap-1 items-center text-sm px-2">
                                                    <Copy size={14} className="text-gray-400" /> Copy
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
                                                        <div className="relative group/code">
                                                            <button
                                                                onClick={() => handleCopy(codeContent)}
                                                                className="absolute top-2 right-2 transition p-1 rounded-md bg-background hover:bg-zinc-700"
                                                            >
                                                                {copiedText === codeContent ? (
                                                                    <p className="flex items-center text-sm px-2">
                                                                        <Check size={14} className="text-green-400" /> Copied
                                                                    </p>
                                                                ) : (
                                                                    <p className="flex items-center text-sm px-2">
                                                                        <Copy size={14} className="text-gray-400" /> Copy code
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
                                                                    padding: "1rem",
                                                                    fontSize: "0.9rem",
                                                                    overflowX: "auto",
                                                                }}
                                                                {...props}
                                                            >
                                                                {codeContent}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code
                                                            className="bg-[#1d1c1c] text-[#f8f8f2] px-1 py-0.5 rounded"
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

                        {error && <p className="text-red-500 text-center">{error}</p>}
                    </div> : (
                        // ✅ Skeleton Loader
                        <div className="w-full max-w-4xl mt-10 mb-4 flex flex-col gap-4 animate-pulse">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-3">
                                    <div className="w-[250px] h-10 bg-muted rounded-2xl self-start"></div>
                                    <div className="w-[200px] h-10 bg-primary rounded-2xl self-end"></div>
                                </div>
                            ))}
                        </div>
                    )}
                <Link href="/" className="px-4 py-2 bg-muted rounded-2xl">New Chat</Link>
            </main>
        </div>
    );
};

export default Page;
