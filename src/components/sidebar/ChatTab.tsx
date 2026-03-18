import { useState, useRef } from "react"
import { Send } from "lucide-react"
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
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nenhuma mensagem ainda</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col gap-1 ${msg.userId === currentUser.id ? "items-end" : "items-start"}`}
                        >
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                                {msg.userName}
                            </span>
                            <div
                                className="px-3 py-2 rounded-xl text-sm max-w-[85%] break-words"
                                style={msg.userId === currentUser.id ? {
                                    background: "rgba(230,57,70,0.2)",
                                    color: "var(--text-primary)",
                                    borderTopRightRadius: 4,
                                } : {
                                    background: "var(--bg-elevated)",
                                    color: "var(--text-secondary)",
                                    borderTopLeftRadius: 4,
                                }}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={endRef} />
            </div>

            <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--border-default)" }}>
                <input
                    className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
                    style={{
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-default)",
                        color: "var(--text-primary)",
                    }}
                    placeholder="Mensagem..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button
                    onClick={send}
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-lg text-white flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: "var(--accent-red)" }}
                >
                    <Send size={15} />
                </button>
            </div>
        </div>
    )
}