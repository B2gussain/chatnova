'use client'

import Header from '@/componets/Header'
import axios from 'axios'
import { ArrowUp, Brain, Divide, Flower, GraduationCap, NotebookPen } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

const Page = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [prompt, setPrompt] = useState('')
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])




    const handleInput = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }

    const prompt_handle = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessages((prev) => [...prev, { role: 'user', content: prompt }])
        console.log('Submitted prompt:', prompt)
        const res = await axios.post("/api/groq", { prompt: prompt });
        console.log('Response from server:', res.data);
        setMessages((prev) => [...prev, { role: 'assistant', content: res.data.message }])
        setPrompt("")
    }

    return (
        <div className="h-dvh w-full bg-background relative">
            <Header />

            {/* ✅ Fixed center element that stays centered even with keyboard */}

            {messages.length === 0 ? (<div className="fixed top-1/2 left-1/2 py-4 -translate-x-1/2 w-full -translate-y-1/2 flex flex-col justify-center items-center gap-2 text-center opacity-0 animate-[fadeIn_2s_ease-in-out_forwards] pointer-events-none">
                <div className="h-[100px] w-[100px] rounded-full flex justify-center items-center border-6 border-t-primary border-b-primary border-muted animate-spin-slow">
                    <div className="flex justify-center items-center rounded-full animate-spin-reverse">
                        <Image
                            src="/logo.png"
                            height={70}
                            width={70}
                            alt="Logo"
                            className="select-none"
                        />
                    </div>
                </div>

                <h2 className="font-semibold text-3xl">
                    Chat<span className="text-primary">Nova</span> is here
                </h2>
                <h3 className="font-semibold text-2xl">
                    how can I help you <span className="text-primary">today</span>?
                </h3>
                <div className='flex gap-2 mt-2 flex-wrap justify-center'>
                    <div className='text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center '><NotebookPen className='text-[#ff7300] mr-2' /> Summarize text</div>
                    <div className='text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center '><Brain className='text-[yellow] mr-2' /> Brainstorm ideas</div>
                    <div className='text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center '><Flower className='text-[green] mr-2' /> Surprise me</div>
                    <div className='text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center '><GraduationCap className='text-[blue] mr-2' /> Get advice</div>



                </div>
            </div>) : <><div className='flex flex-col gap-4 mb-24 pt-14 px-4 mt-8'>
                {messages.map((message, index) => (
                    <div className="flex flex-col" key={index}>
                        {message.role === 'user' ? (
                            <p
                                className="bg-primary  text-white  self-end rounded-4xl  px-3 py-2 max-w-[90%] w-fit text-right "
                            >
                                {message.content}
                            </p>
                        ) : (
                            <p className=" bg-muted/0  text-white self-start rounded-lg px-3 py-2 max-w-[90%] w-fit text-left">
                                {message.content}
                            </p>
                        )}
                    </div>
                ))}

            </div>
            </>}


            {/* ✅ Input field fixed at bottom */}
            <form
                onSubmit={prompt_handle}
                className="w-[96%] mx-auto flex left-1/2 -translate-x-1/2 bg-muted fixed bottom-2 rounded-4xl p-1 items-end"
            >
                <textarea
                    ref={textareaRef}
                    onInput={handleInput}
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                    rows={1}
                    placeholder="Ask ChatNova"
                    className="flex-1 resize-none bg-transparent outline-none border-none p-3 text-foreground placeholder:text-gray-400 max-h-40 overflow-y-auto"
                    style={{ lineHeight: '1.5' }}
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
