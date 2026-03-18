import { useState } from "react"
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

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
        id: "playlist",
        label: "Fila",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "users",
        label: "Sala",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "chat",
        label: "Chat",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
]

export function Sidebar({ roomId, videoState, users, currentUser, onAddVideo, onRemoveVideo, onSkip, onUpdateName }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("playlist")

    return (
        <div className="flex flex-col h-full bg-[#0d0d0d] border-l border-[#1a1a1a]">
            {/* Tabs */}
            <div className="flex border-b border-[#1a1a1a]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all duration-150 ${
                            activeTab === tab.id
                                ? "text-white border-b-2 border-[#e63946]"
                                : "text-[#444] hover:text-[#777]"
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === "playlist" && (
                    <PlaylistTab
                        videoState={videoState}
                        currentUser={currentUser}
                        onAddVideo={onAddVideo}
                        onRemoveVideo={onRemoveVideo}
                        onSkip={onSkip}
                    />
                )}
                {activeTab === "users" && (
                    <UsersTab
                        roomId={roomId}
                        users={users}
                        currentUser={currentUser}
                        onUpdateName={onUpdateName}
                    />
                )}
                {activeTab === "chat" && (
                    <ChatTab currentUser={currentUser} />
                )}
            </div>
        </div>
    )
}