'use client'

import Header from '@/componets/Header'
import axios from 'axios'
import { ArrowUp, Brain, Flower, GraduationCap, NotebookPen, Copy, Check } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Page = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [prompt, setPrompt] = useState('')
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
    const [copiedText, setCopiedText] = useState<string>("")

    const handleInput = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedText(text)
            setTimeout(() => setCopiedText(""), 1500)
        } catch (error) {
            console.error("Copy failed", error)
        }
    }

    const prompt_handle = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessages((prev) => [...prev, { role: 'user', content: prompt }])
        const res = await axios.post("/api/groq", { prompt })
        setMessages((prev) => [...prev, { role: 'assistant', content: res.data.message }])
        setPrompt("")
    }

    return (
        <div className="h-dvh w-full bg-background relative">
            <Header />

            {messages.length === 0 ? (
                <div className="fixed top-1/2 left-1/2 py-4 -translate-x-1/2 w-full -translate-y-1/2 flex flex-col justify-center items-center gap-2 text-center opacity-0 animate-[fadeIn_2s_ease-in-out_forwards] pointer-events-none">
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
                        <div className='text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center'><NotebookPen className='text-[#ff7300] mr-2' /> Summarize text</div>
                        <div className='text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center '><Brain className='text-[yellow] mr-2' /> Brainstorm ideas</div>
                        <div className='text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center '><Flower className='text-[green] mr-2' /> Surprise me</div>
                        <div className='text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center '><GraduationCap className='text-[blue] mr-2' /> Get advice</div>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col gap-4 mb-24 pb-40 pt-14 px-4 mt-8'>
                    {messages.map((message, index) => (
                        <div className="flex flex-col" key={index}>
                            {message.role === 'user' ? (
                                <p className="bg-primary text-white self-end rounded-4xl px-3 py-2 max-w-full w-fit text-right">
                                    {message.content}
                                </p>
                            ) : (
                                <div className="bg-muted/0 text-white self-start rounded-lg px-3 py-2 max-w-full w-fit text-left prose prose-invert relative group">
                                    {/* ✅ Copy full response button */}
                                    <button
                                        onClick={() => handleCopy(message.content)}
                                        className="absolute -bottom-5  group-opacity-100 transition-opacity p-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
                                    >
                                        {copiedText === message.content ? (
                                            <p className='flex gap-1 justify-center items-center text-sm px-2'>  <Check size={14} className="text-green-400" /> Copied</p>

                                        ) : (
                                            <p className='flex gap-1 justify-center items-center text-sm px-2'>  <Copy size={14} className="text-gray-400" /> Copy</p>

                                        )}
                                    </button>

                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || "")
                                                const codeContent = String(children).replace(/\n$/, "")

                                                return !inline && match ? (
                                                    <div className="relative group/code">
                                                        {/* ✅ Copy button for code blocks */}
                                                        <button
                                                            onClick={() => handleCopy(codeContent)}
                                                            className="absolute top-2 right-2  code:opacity-100 transition-opacity p-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
                                                        >
                                                            {copiedText === codeContent ? (
                                                                <p className='flex justify-center items-center text-sm px-2'>  <Check size={14} className="text-green-400" /> Copied</p>

                                                            ) : (
                                                                <p className='flex justify-center items-center text-sm px-2'>  <Copy size={14} className="text-gray-400" /> Copy</p>

                                                            )}
                                                        </button>

                                                        <SyntaxHighlighter
                                                            style={atomOneDark}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            customStyle={{
                                                                background: "#1e1e1e",
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
                                                        className="bg-[#2d2d2d] text-[#f8f8f2] px-1 py-0.5 rounded"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                )
                                            },
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

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
