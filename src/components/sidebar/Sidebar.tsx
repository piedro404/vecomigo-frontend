import { useState } from "react"
import { ListMusic, Users, MessageCircle } from "lucide-react"
import type { VideoState } from "@app-types/modules/video.types"
import type { User } from "@app-types/modules/user.types"
import { PlaylistTab } from "./PlaylistTab"
import { UsersTab } from "./UsersTab"
import { ChatTab } from "./ChatTab"

type Tab = "playlist" | "users" | "chat"

type Props = {
    roomId: string
    videoState: VideoState | null
    users: User[]
    currentUser: User
    onAddVideo: (video: any, playNow?: boolean) => void
    onRemoveVideo: (videoId: string) => void
    onSkip: () => void
    onUpdateName: (name: string) => void
}

const tabs = [
    { id: "playlist", label: "Fila", icon: <ListMusic size={16} /> },
    { id: "users", label: "Sala", icon: <Users size={16} /> },
    { id: "chat", label: "Chat", icon: <MessageCircle size={16} /> },
]

export function Sidebar(props: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("playlist")

    return (
        <div className="flex flex-col h-full border-l" style={{ background: "var(--bg-surface)", borderColor: "var(--border-default)" }}>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: "var(--border-default)" }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all"
                        style={{
                            color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-muted)",
                            borderBottom: activeTab === tab.id ? "2px solid var(--accent-red)" : "2px solid transparent",
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === "playlist" && <PlaylistTab {...props} />}
                {activeTab === "users" && <UsersTab {...props} />}
                {activeTab === "chat" && <ChatTab currentUser={props.currentUser} />}
            </div>
        </div>
    )
}