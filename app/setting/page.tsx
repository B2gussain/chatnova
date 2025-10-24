"use client";

import Sidebar from "@/componets/Sidebar";
import { Menu, LogOut } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Page = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-dvh overflow-x-hidden">
      {/* Expand Button */}
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

      {/* Main Content */}
      <main
        className={`flex-1 h-dvh w-full flex flex-col justify-start items-center bg-background transition-all duration-300 pt-10 ${
          !isMobile && isSidebarOpen ? "md:ml-64" : ""
        }`}
      >
        <h1 className="text-3xl font-semibold text-white mb-6">Settings</h1>

        {isLoaded ? (
          isSignedIn && user ? (
            <div className="flex flex-col items-center gap-4">
              {/* User Avatar */}
              <img
                src={user.imageUrl}
                alt={user.fullName || "User Avatar"}
                className="w-24 h-24 rounded-full border-2 border-primary object-cover"
              />

              {/* User Details */}
              <div className="text-center">
                <p className="text-white font-semibold text-xl">
                  {user.fullName || "No Name"}
                </p>
                <p className="text-gray-400">
                  {user.primaryEmailAddress?.emailAddress || "No Email"}
                </p>
                {user.username && <p className="text-gray-400">@{user.username}</p>}
                {user.phoneNumbers?.length > 0 && (
                  <p className="text-gray-400">{user.phoneNumbers[0].phoneNumber}</p>
                )}
               
              </div>

              {/* Logout Button */}
              <SignOutButton>
                <button className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg mt-4">
                  <LogOut size={20} />
                  Logout
                </button>
              </SignOutButton>
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Sign In
            </button>
          )
        ) : (
          <p className="text-gray-400">Loading...</p>
        )}
      </main>
    </div>
  );
};

export default Page;
