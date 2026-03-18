import { useState } from "react"
import { Copy, Check, Pencil } from "lucide-react"
import type { User } from "@app-types/modules/user.types"

type Props = {
    roomId: string
    users: User[]
    currentUser: User
    onUpdateName: (name: string) => void
}

export function UsersTab({ roomId, users, currentUser, onUpdateName }: Props) {
    const [copied, setCopied] = useState(false)
    const [editingName, setEditingName] = useState(false)
    const [nameInput, setNameInput] = useState(currentUser.name)

    const inviteLink = `${window.location.origin}/room/${roomId}`

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const saveName = () => {
        if (nameInput.trim()) onUpdateName(nameInput.trim())
        setEditingName(false)
    }

    return (
        <div className="flex flex-col">

            {/* Invite */}
            <div className="p-4 flex flex-col gap-2" style={{ borderBottom: "1px solid var(--border-default)" }}>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-soft)" }}>
                    Convidar
                </p>
                <button
                    onClick={copyLink}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all"
                    style={copied ? {
                        background: "rgba(230,57,70,0.1)",
                        border: "1px solid rgba(230,57,70,0.3)",
                        color: "var(--accent-red)",
                    } : {
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-default)",
                        color: "var(--text-soft)",
                    }}
                >
                    {copied ? <Check size={14} className="flex-shrink-0" /> : <Copy size={14} className="flex-shrink-0" />}
                    <span className="truncate flex-1 text-left font-mono">
                        {copied ? "Link copiado!" : inviteLink}
                    </span>
                </button>
            </div>

            {/* My identity */}
            <div className="p-4 flex flex-col gap-2" style={{ borderBottom: "1px solid var(--border-default)" }}>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-soft)" }}>
                    Você
                </p>
                {editingName ? (
                    <div className="flex gap-2">
                        <input
                            autoFocus
                            className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none"
                            style={{
                                background: "var(--bg-input)",
                                border: "1px solid var(--border-strong)",
                                color: "var(--text-primary)",
                            }}
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveName()}
                        />
                        <button
                            onClick={saveName}
                            className="px-3 py-2 rounded-lg text-white text-xs font-medium"
                            style={{ background: "var(--accent-red)" }}
                        >
                            Ok
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => { setNameInput(currentUser.name); setEditingName(true) }}
                        className="flex items-center gap-3 p-2 rounded-lg transition-all group"
                        style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)" }}
                    >
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                                background: "rgba(230,57,70,0.2)",
                                border: "1px solid rgba(230,57,70,0.3)",
                                color: "var(--accent-red)",
                            }}
                        >
                            {currentUser.name[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm flex-1 text-left" style={{ color: "var(--text-primary)" }}>
                            {currentUser.name}
                        </span>
                        <Pencil size={14} style={{ color: "var(--text-muted)" }} />
                    </button>
                )}
            </div>

            {/* Users list */}
            <div className="p-4 flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-soft)" }}>
                    Na sala · {users.length}
                </p>
                {users.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 py-1.5">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={u.id === currentUser.id ? {
                                background: "rgba(230,57,70,0.2)",
                                border: "1px solid rgba(230,57,70,0.3)",
                                color: "var(--accent-red)",
                            } : {
                                background: "var(--bg-elevated)",
                                color: "var(--text-soft)",
                            }}
                        >
                            {u.name[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm" style={{ color: u.id === currentUser.id ? "var(--text-primary)" : "var(--text-soft)" }}>
                            {u.name}
                            {u.id === currentUser.id && (
                                <span className="ml-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>(você)</span>
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}