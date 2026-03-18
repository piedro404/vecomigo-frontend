import { useState, useRef } from "react"
import type { User } from "@app-types/modules/user.types"

type ChatMessage = {
    id: string
    userId: string
    userName: string
    text: string
}

type Props = {
    currentUser: User
}

export function ChatTab({ currentUser }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")
    const endRef = useRef<HTMLDivElement>(null)

    const send = () => {
        if (!input.trim()) return
        setMessages((prev) => [...prev, {
            id: crypto.randomUUID(),
            userId: currentUser.id,
            userName: currentUser.name,
            text: input.trim(),
        }])
        setInput("")
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-10">
                        <p className="text-[#333] text-sm">Nenhuma mensagem ainda</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col gap-1 ${msg.userId === currentUser.id ? "items-end" : "items-start"}`}
                        >
                            <span className="text-[10px] text-[#444]">{msg.userName}</span>
                            <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words ${
                                msg.userId === currentUser.id
                                    ? "bg-[#e63946]/20 text-white rounded-tr-sm"
                                    : "bg-[#1a1a1a] text-[#ccc] rounded-tl-sm"
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-[#1a1a1a] flex gap-2">
                <input
                    className="flex-1 bg-[#141414] border border-[#1e1e1e] rounded-lg px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#333] transition-colors"
                    placeholder="Mensagem..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button
                    onClick={send}
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-lg bg-[#e63946] hover:bg-[#c1121f] text-white flex items-center justify-center transition-all disabled:opacity-30"
                >
                    <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}