"use client";

import Sidebar from "@/componets/Sidebar";
import { Menu, LogOut, Mail, History, Phone } from "lucide-react";

import React, { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

      {/* Main Content */}
      <main
        className={`flex-1 h-dvh w-full flex flex-col justify-start items-center bg-background transition-all duration-300 pt-10 ${!isMobile && isSidebarOpen ? "md:ml-64" : ""
          }`}
      >
        <h1 className="text-3xl font-semibold text-white mb-6">Settings</h1>

        {isLoaded ? (
          isSignedIn && user ? (
            <div className="flex flex-col w-full px-6  items-center gap-4">
              <div className="flex items-center w-full max-w-3xl justify-start gap-2">  <Image
                height={50}
                width={50}
                src={user.imageUrl}
                alt={user.fullName || "User Avatar"}
                className=" rounded-full border-2  object-cover"
              />  <p className="text-white font-semibold text-xl">
                  {user.fullName || "No Name"}
                </p>
              </div>
              <div className="flex items-center w-full max-w-3xl gap-2">
                <Mail size={30} /><div className="flex leading-5 flex-col">
                  <p>Email</p>
                  <p className="text-gray-400">
                    {user.primaryEmailAddress?.emailAddress || "No Email"}
                  </p>
                </div>
                
              </div>
              <Link href="/history" className="flex gap-2 items-center w-full max-w-3xl"><History size={30} />History</Link>



             

              {/* Logout Button */}
              <SignOutButton>
                <button className="flex w-full items-center max-w-3xl cursor-pointer gap-2 py-3 text-red-600 hover:text-red-700   rounded-lg ">
                  <LogOut size={30} />
                  Sign out
                </button>
              </SignOutButton>
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="w-full max-w-3xl py-3 text-blue-600  hover:text-blue-700 cursor-pointer  rounded-lg"
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
