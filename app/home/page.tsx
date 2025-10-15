'use client'

import Header from '@/componets/Header'
import { ArrowUp } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

const Page = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [prompt, setprompt] = useState("")

    // 🔹 Automatically resize textarea as user types
    const handleInput = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto' // reset height
            textarea.style.height = `${textarea.scrollHeight}px` // set to scroll height
        }
        console.log(prompt)

    }
    const prompt_handle = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Submitted prompt:", prompt)
    }

    return (
        <div className="h-dvh w-full bg-background relative">
            <Header />
            <div className='flex flex-col  gap-4'>
                <div className='h-full flex flex-col justify-center items-center gap-2 opacity-0 animate-[fadeIn_2s_ease-in-out_forwards]'>
                    <div className="h-[100px] w-[100px] mx-auto mt-18 rounded-full flex justify-center items-center border-6 border-t-primary border-b-primary border-muted animate-spin-slow">
                        <div className=" flex justify-center items-center rounded-full  animate-spin-reverse">
                            <Image
                                src="/logo.png"
                                height={70}
                                width={70}
                                alt="Logo"
                                className="select-none"
                            />
                        </div>

                    </div>

                    <h2 className='text-center font-semibold text-3xl '>Chat<span className='text-primary  '>Nova</span> is here</h2>
                    <h3 className='text-center font-semibold text-2xl'>how can I help you <span className='text-primary'>today</span>?</h3>
                </div>






            </div>

            <form
                action=""
                onSubmit={prompt_handle}
                className="w-[96%] mx-auto flex left-1/2 -translate-x-1/2 bg-muted fixed bottom-4 rounded-4xl p-1 items-end"
            >
                {/* 🔹 Replace input with textarea */}
                <textarea
                    ref={textareaRef}
                    onInput={handleInput}
                    onChange={(e) => setprompt(e.target.value)}
                    rows={1}
                    placeholder="Ask ChatNova"
                    className="flex-1 resize-none bg-transparent outline-none border-none p-3 text-foreground placeholder:text-gray-400 max-h-40 overflow-y-auto"
                    style={{
                        lineHeight: '1.5',
                    }}
                />

                <button
                    type="submit"
                    className="bg-primary flex justify-center items-center rounded-full h-12 w-12 text-white ml-2"
                >
                    <ArrowUp />
                </button>
            </form>
        </div>
    )
}

export default Page
