import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import type { User } from "@app-types/modules/user.types";
import type { Chat } from "@app-types/modules/chat.types";

type Props = {
    currentUser: User;
    chat: Chat[];
    onSendMessage: (message: Chat) => void;
};

export function ChatTab({ currentUser, chat, onSendMessage }: Props) {
    const [input, setInput] = useState("");
    const [isAtBottom, setIsAtBottom] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    const getUserColor = (id: string) => {
        const colors = [
            "#E63946",
            "#457B9D",
            "#2A9D8F",
            "#F4A261",
            "#8D99AE",
            "#9B5DE5",
        ];
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash += id.charCodeAt(i);
        }
        return colors[hash % colors.length];
    };

    const formatTime = (date: string | number) => {
        return new Date(date).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (date: string | number) => {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatSmartDate = (date: string | number) => {
        const d = new Date(date);
        const today = new Date();

        if (d.toDateString() === today.toDateString()) return "Hoje";

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (d.toDateString() === yesterday.toDateString())
            return "Ontem";

        return formatDate(date);
    };

    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;

        const threshold = 50;
        const atBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

        setIsAtBottom(atBottom);
    };

    useEffect(() => {
        if (isAtBottom) {
            endRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat, isAtBottom]);

    const send = () => {
        if (!input.trim()) return;

        onSendMessage({
            id: crypto.randomUUID(),
            user: currentUser,
            message: input.trim(),
            createdAt: Date.now(),
        });

        setInput("");
    };

    return (
        <div className="flex flex-col h-full relative">
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-3 py-4 md:px-4 flex flex-col gap-3"
            >
                {chat.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-10">
                        <p
                            className="text-sm"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Nenhuma mensagem ainda
                        </p>
                    </div>
                ) : (
                    chat.map((msg, index) => {
                        const prev = chat[index - 1];

                        const isSameUser = prev?.user.id === msg.user.id;
                        const isCurrentUser =
                            msg.user.id === currentUser.id;

                        const userColor = getUserColor(msg.user.id);

                        const currentDate = new Date(
                            msg.createdAt,
                        ).toDateString();
                        const prevDate = prev
                            ? new Date(prev.createdAt).toDateString()
                            : null;

                        const showDateDivider =
                            currentDate !== prevDate;

                        return (
                            <div key={msg.id}>
                                {showDateDivider && (
                                    <div className="flex justify-center my-3">
                                        <span
                                            className="text-[11px] px-3 py-1 rounded-full"
                                            style={{
                                                background:
                                                    "var(--bg-elevated)",
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            {formatSmartDate(
                                                msg.createdAt,
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={`flex flex-col ${
                                        isCurrentUser
                                            ? "items-end"
                                            : "items-start"
                                    }`}
                                >
                                    {!isSameUser && (
                                        <span
                                            className="text-[11px] font-semibold mb-1"
                                            style={{ color: userColor }}
                                        >
                                            {msg.user.name}
                                        </span>
                                    )}

                                    <div
                                        className={`px-3 py-2 rounded-2xl text-sm max-w-[85%] sm:max-w-[75%] break-words shadow-sm flex flex-col gap-1`}
                                        style={
                                            isCurrentUser
                                                ? {
                                                      background:
                                                          "var(--accent-red)",
                                                      color: "#fff",
                                                      borderTopRightRadius: 6,
                                                  }
                                                : {
                                                      background:
                                                          "var(--bg-elevated)",
                                                      color:
                                                          "var(--text-primary)",
                                                      borderTopLeftRadius: 6,
                                                  }
                                        }
                                    >
                                        <span className="leading-relaxed">
                                            {msg.message}
                                        </span>

                                        <span
                                            className="text-[10px] self-end opacity-70"
                                            style={{
                                                color: isCurrentUser
                                                    ? "#fff"
                                                    : "var(--text-muted)",
                                            }}
                                        >
                                            {formatTime(
                                                msg.createdAt,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                <div ref={endRef} />
            </div>

            {!isAtBottom && (
                <button
                    onClick={() =>
                        endRef.current?.scrollIntoView({
                            behavior: "smooth",
                        })
                    }
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1 text-xs rounded-full shadow-md"
                    style={{
                        background: "var(--accent-red)",
                        color: "#fff",
                    }}
                >
                    ↓ Novas mensagens
                </button>
            )}

            <div
                className="p-2 sm:p-3 flex gap-2 items-center"
                style={{ borderTop: "1px solid var(--border-default)" }}
            >
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
                    className="w-10 h-10 sm:w-9 sm:h-9 rounded-lg text-white flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: "var(--accent-red)" }}
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}