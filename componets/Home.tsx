'use client'

import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowUp, Brain, Flower, GraduationCap, NotebookPen, Copy, Check, Menu } from 'lucide-react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Sidebar from './Sidebar'

const Home = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [prompt, setPrompt] = useState('')
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
    const [copiedText, setCopiedText] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

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
            setTimeout(() => setCopiedText(''), 1500)
        } catch (error) {
            console.error('Copy failed', error)
        }
    }

    const prompt_handle = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim()) return
        setIsLoading(true)
        setError(null)
        setMessages((prev) => [...prev, { role: 'user', content: prompt }])

        try {
            const res = await axios.post('/api/groq', { prompt })
            setMessages((prev) => [...prev, { role: 'assistant', content: res.data.message }])
        } catch (err) {
            setError('Failed to fetch response. Please try again.')
            console.error('API error:', err)
        } finally {
            setIsLoading(false)
            setPrompt('')
        }
    }

    return (
        <div className="flex h-dvh overflow-x-hidden">
            {/* Expand Button - Always show when sidebar is closed (both mobile and desktop) */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed top-4 left-4 cursor-pointer z-50 bg-background border-white border flex justify-center items-center text-white px-3 py-2 rounded-full "
                >
                    <Image src="/logo.png" width={28} height={28} alt="ChatNova Logo" />
                    <Menu size={20}  />
                </button>
            )}

            {/* Sidebar with overlay for mobile */}
            <div className={`
        ${isMobile ? 'fixed inset-0 z-40' : 'fixed inset-y-0 left-0 z-40'} 
        ${!isSidebarOpen ? 'hidden' : 'block'}
      `}>
                {isMobile && isSidebarOpen && (
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

            {/* Main Content */}
            <div className={`h-dvh w-full flex flex-col justify-center item-center bg-background transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''
                }`}>
                {messages.length === 0 ? (
                    <div className="py-4 w-full mx-auto flex flex-col justify-center items-center gap-2 text-center opacity-0 animate-[fadeIn_2s_ease-in-out_forwards]">
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
                        <div className="flex gap-2 mt-2 flex-wrap justify-center">
                            <div
                                className="text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center cursor-pointer"
                                onClick={() => {
                                    setPrompt('Summarize text')
                                    textareaRef.current?.focus()
                                }}
                            >
                                <NotebookPen className="text-[#ff7300] mr-2" /> Summarize text
                            </div>
                            <div
                                className="text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center cursor-pointer"
                                onClick={() => {
                                    setPrompt('Brainstorm ideas')
                                    textareaRef.current?.focus()
                                }}
                            >
                                <Brain className="text-[yellow] mr-2" /> Brainstorm ideas
                            </div>
                            <div
                                className="text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center cursor-pointer"
                                onClick={() => {
                                    setPrompt('Surprise me')
                                    textareaRef.current?.focus()
                                }}
                            >
                                <Flower className="text-[green] mr-2" /> Surprise me
                            </div>
                            <div
                                className="text-foreground/50 border-[2px] border-muted rounded-full px-3 py-1 flex justify-center items-center cursor-pointer"
                                onClick={() => {
                                    setPrompt('Get advice')
                                    textareaRef.current?.focus()
                                }}
                            >
                                <GraduationCap className="text-[blue] mr-2" /> Get advice
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full overflow-y-auto flex-col gap-4 mb-10 mt-16 pb-26 pt-14 px-4 ">
                        {messages.map((message, index) => (
                            <div className="flex flex-col" key={index}>
                                {message.role === 'user' ? (
                                    <p className="bg-primary text-white self-end rounded-4xl px-3 py-2 max-w-full w-fit text-right">
                                        {message.content}
                                    </p>
                                ) : (
                                    <div className="bg-muted/0 text-white self-start rounded-lg px-3 py-2 max-w-full w-fit text-left prose prose-invert relative group">
                                        <button
                                            onClick={() => handleCopy(message.content)}
                                            className="absolute -bottom-5 transition-opacity p-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
                                        >
                                            {copiedText === message.content ? (
                                                <p className="flex gap-1 justify-center items-center text-sm px-2">
                                                    <Check size={14} className="text-green-400" /> Copied
                                                </p>
                                            ) : (
                                                <p className="flex gap-1 justify-center items-center text-sm px-2">
                                                    <Copy size={14} className="text-gray-400" /> Copy
                                                </p>
                                            )}
                                        </button>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                code({ inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    const codeContent = String(children).replace(/\n$/, '')
                                                    return !inline && match ? (
                                                        <div className="relative group/code">
                                                            <button
                                                                onClick={() => handleCopy(codeContent)}
                                                                className="absolute top-2 right-2 transition-opacity p-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
                                                            >
                                                                {copiedText === codeContent ? (
                                                                    <p className="flex justify-center items-center text-sm px-2">
                                                                        <Check size={14} className="text-green-400" /> Copied
                                                                    </p>
                                                                ) : (
                                                                    <p className="flex justify-center items-center text-sm px-2">
                                                                        <Copy size={14} className="text-gray-400" /> Copy
                                                                    </p>
                                                                )}
                                                            </button>
                                                            <SyntaxHighlighter
                                                                style={atomOneDark}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{
                                                                    background: '#181717',
                                                                    borderRadius: '0.5rem',
                                                                    padding: '1rem',
                                                                    fontSize: '0.9rem',
                                                                    overflowX: 'auto',
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
                        {error && <p className="text-red-500 text-center">{error}</p>}
                    </div>
                )}
                <form
                    onSubmit={prompt_handle}
                    className={`mx-auto flex bg-muted rounded-4xl p-1 items-end sticky bottom-4  justify-center  w-[90%] md:w-[80%]`}
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
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-primary cursor-pointer flex justify-center items-center rounded-full h-12 w-12 text-white ml-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="animate-spin h-6 w-6 border-4 border-t-transparent border-white rounded-full" />
                        ) : (
                            <ArrowUp />
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Home