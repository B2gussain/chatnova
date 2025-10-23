"use client";

import Sidebar from "@/componets/Sidebar";
 // ✅ Fixed the typo in "components"
import { Menu } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const Page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // ✅ Detect screen size to switch between mobile and desktop behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // Check immediately
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-dvh overflow-x-hidden">
            {/* === Expand Button === */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed top-4 left-4 cursor-pointer z-50 bg-background border border-white flex justify-center items-center text-white px-3 py-2 rounded-full shadow-md hover:scale-105 transition"
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
                    className={`${
                        isMobile
                            ? "fixed inset-0 z-40"
                            : "fixed inset-y-0 left-0 z-40"
                    }`}
                >
                    {/* Overlay for mobile */}
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
                className={`flex-1 h-dvh w-full flex flex-col justify-center items-center bg-background transition-all duration-300 ${
                    !isMobile && isSidebarOpen ? "md:ml-64" : ""
                }`}
            >
                <h1 className="text-2xl font-semibold text-white">
                History
                </h1>
            </main>
        </div>
    );
};

export default Page;
