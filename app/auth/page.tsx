"use client";

import React, { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthPage() {
    const router = useRouter();

    const { isLoaded: signInLoaded, signIn } = useSignIn();
    const { isLoaded: signUpLoaded, signUp } = useSignUp();

    const [mode, setMode] = useState<"signin" | "signup">("signin"); // toggle between sign-in and sign-up

    const handleOAuth = async (provider: string) => {
        const target = mode === "signin" ? signIn : signUp;
        const ready = mode === "signin" ? signInLoaded : signUpLoaded;
        if (!ready || !target) return;

        await target.authenticateWithRedirect({
            strategy: provider,
            redirectUrl: "/", // where Clerk redirects back
            redirectUrlComplete: "/",
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-white">
            <div className="  p-8  w-full max-w-sm text-center">
                <div className="flex animate-bounce mb-3 items-center justify-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={48}
                        height={48}
                        className=" "
                    />
                    <h1 className="text-3xl font-bold bg-gradient-to-br from-primary via-accent-primary to-muted text-transparent bg-clip-text">
                        ChatNova
                    </h1>
                </div>

                <p className="text-gray-400 mb-6">
                    {mode === "signin"
                        ? "Sign in to continue to ChatNova"
                        : "Sign up to start chatting with AI"}
                </p>

                <div className="space-y-4">
                    {/* Google */}
                    <button
                        onClick={() => handleOAuth("oauth_google")}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-lg py-2  hover:opacity-90 transition"
                    >
                        <Image
                            src="/Google_logo.svg"
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        Continue with Google
                    </button>
                </div>

                <p className="text-gray-400 text-sm mt-6">
                    {mode === "signin" ? (
                        <>
                            Don’t have an account?{" "}
                            <button
                                onClick={() => setMode("signup")}
                                className="text-blue-400 hover:underline"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => setMode("signin")}
                                className="text-blue-400 hover:underline"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
