import { useState } from "react"
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
            <div className="p-4 border-b border-[#1a1a1a] flex flex-col gap-2">
                <p className="text-[#555] text-xs font-medium uppercase tracking-wider">Convidar</p>
                <button
                    onClick={copyLink}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs ${
                        copied
                            ? "bg-[#e63946]/10 border-[#e63946]/30 text-[#e63946]"
                            : "bg-[#141414] border-[#222] text-[#666] hover:text-white hover:border-[#333]"
                    }`}
                >
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        {copied
                            ? <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                            : <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                        }
                    </svg>
                    <span className="truncate flex-1 text-left font-mono">
                        {copied ? "Link copiado!" : inviteLink}
                    </span>
                </button>
            </div>

            {/* My identity */}
            <div className="p-4 border-b border-[#1a1a1a] flex flex-col gap-2">
                <p className="text-[#555] text-xs font-medium uppercase tracking-wider">Você</p>
                {editingName ? (
                    <div className="flex gap-2">
                        <input
                            autoFocus
                            className="flex-1 bg-[#141414] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveName()}
                        />
                        <button
                            onClick={saveName}
                            className="px-3 py-2 rounded-lg bg-[#e63946] text-white text-xs font-medium"
                        >
                            Ok
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => { setNameInput(currentUser.name); setEditingName(true) }}
                        className="flex items-center gap-3 p-2 rounded-lg bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-all group"
                    >
                        <div className="w-7 h-7 rounded-full bg-[#e63946]/20 border border-[#e63946]/30 flex items-center justify-center text-[#e63946] text-xs font-bold flex-shrink-0">
                            {currentUser.name[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm text-white flex-1 text-left">{currentUser.name}</span>
                        <svg className="w-3.5 h-3.5 text-[#444] group-hover:text-[#777] transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Users list */}
            <div className="p-4 flex flex-col gap-2">
                <p className="text-[#555] text-xs font-medium uppercase tracking-wider">
                    Na sala · {users.length}
                </p>
                {users.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 py-1.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            u.id === currentUser.id
                                ? "bg-[#e63946]/20 border border-[#e63946]/30 text-[#e63946]"
                                : "bg-[#1a1a1a] text-[#555]"
                        }`}>
                            {u.name[0]?.toUpperCase()}
                        </div>
                        <span className={`text-sm ${u.id === currentUser.id ? "text-white" : "text-[#666]"}`}>
                            {u.name}
                            {u.id === currentUser.id && (
                                <span className="ml-1.5 text-[10px] text-[#333]">(você)</span>
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}