"use client";

import React, { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { OAuthStrategy } from "@clerk/types"; 
export default function AuthPage() {
    // const router = useRouter();
    const [loader, setloader] = useState(false)
    const { isLoaded: signInLoaded, signIn } = useSignIn();
    const { isLoaded: signUpLoaded, signUp } = useSignUp();

    const [mode, setMode] = useState<"signin" | "signup">("signin"); // toggle between sign-in and sign-up

    const handleOAuth = async (provider: OAuthStrategy) => {
        setloader(true)
        const target = mode === "signin" ? signIn : signUp;
        const ready = mode === "signin" ? signInLoaded : signUpLoaded;
        if (!ready || !target) return;

        await target.authenticateWithRedirect({
            strategy: provider,
            redirectUrl: "/", // where Clerk redirects back
            redirectUrlComplete: "/",
        });
        setloader(false)
    };

    return (
        <div className="flex items-center justify-center h-dvh bg-background text-white">
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
                    {loader ? <div className=" rounded-lg bg-gradient-to-br from-primary via-accent-primary to-muted  py-2 ">
                        <div role="status " className="justify-center gap-2 flex items-center">
                            <svg aria-hidden="true" className="inline w-5 h-5 text-black animate-spin dark:text-black/80 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <p className=" text-black font-semibold animate-pulse"> Authenticating... </p>
                        </div>
                    </div> : 
                    <button
                        onClick={() => handleOAuth("oauth_google")}
                        className="w-full flex  cursor-pointer items-center justify-center gap-2 bg-white text-black font-semibold rounded-lg py-2  hover:opacity-90 transition"
                    >
                        <Image
                            src="/Google_logo.svg"
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        Continue with Google
                    </button>
                    }

                </div>

                <p className="text-gray-400 text-sm mt-6">
                    {mode === "signin" ? (
                        <>
                            Don’t have an account?{" "}
                            <button
                                onClick={() => setMode("signup")}
                                className="text-blue-400 cursor-pointer hover:underline"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => setMode("signin")}
                                className="text-blue-400 cursor-pointer hover:underline"
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
