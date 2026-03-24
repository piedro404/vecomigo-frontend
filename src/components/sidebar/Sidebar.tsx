import { useEffect, useRef, useState } from "react";
import { ListMusic, Users, MessageCircle } from "lucide-react";
import type { VideoState } from "@app-types/modules/video.types";
import type { User } from "@app-types/modules/user.types";
import { PlaylistTab } from "./PlaylistTab";
import { UsersTab } from "./UsersTab";
import { ChatTab } from "./ChatTab";
import type { Chat } from "@app-types/modules/chat.types";

type Tab = "playlist" | "users" | "chat";

type Props = {
    sidebarOpen: boolean;
    roomId: string;
    currentUser: User;
    users: User[];
    chat: Chat[];
    videoState: VideoState | null;
    onUpdateName: (name: string) => void;
    onAddVideo: (video: any, playNow?: boolean) => void;
    onRemoveVideo: (videoId: string) => void;
    onSkip: () => void;
    onSendMessage: (message: Chat) => void;
};

export function Sidebar(props: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("playlist");
    const [unreadCount, setUnreadCount] = useState(0);
    const prevLengthRef = useRef(props.chat.length);

    useEffect(() => {
        if (props.chat.length > prevLengthRef.current) {
            if (activeTab !== "chat") {
                setUnreadCount(
                    (prev) =>
                        prev + (props.chat.length - prevLengthRef.current),
                );
            }
        }

        prevLengthRef.current = props.chat.length;
    }, [props.chat, activeTab]);

    useEffect(() => {
        if (activeTab === "chat") {
            setUnreadCount(0);
        }
    }, [activeTab]);

    const tabs = [
        { id: "playlist", label: "Fila", icon: <ListMusic size={16} /> },
        { id: "users", label: "Sala", icon: <Users size={16} /> },
        { id: "chat", label: "Chat", icon: <MessageCircle size={16} /> },
    ];

    return (
        <div
            className="flex flex-col h-full border-l"
            style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-default)",
            }}
        >
            {/* Tabs */}
            <div
                className="flex border-b"
                style={{ borderColor: "var(--border-default)" }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all"
                        style={{
                            color:
                                activeTab === tab.id
                                    ? "var(--text-primary)"
                                    : "var(--text-muted)",
                            borderBottom:
                                activeTab === tab.id
                                    ? "2px solid var(--accent-red)"
                                    : "2px solid transparent",
                        }}
                    >
                        <div className="relative">
                            {tab.icon}
                            {tab.id === "chat" && unreadCount > 0 && (
                                <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 text-[10px] flex items-center justify-center rounded-full bg-red-500 text-white font-bold">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </div>

                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === "playlist" && <PlaylistTab {...props} />}
                {activeTab === "users" && <UsersTab {...props} />}
                {activeTab === "chat" && <ChatTab {...props} />}
            </div>
        </div>
    );
}
