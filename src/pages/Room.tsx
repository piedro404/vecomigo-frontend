import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoom } from "@hooks/useRoom";
import { useVideo } from "@hooks/useVideo";
import { useChat } from "@hooks/useChat";

import { VideoPlayer } from "@components/VideoPlayer";
import { VideoControls } from "@components/VideoControls";
import { Sidebar } from "@components/sidebar/Sidebar";
import Logo from "@components/Logo";
    
import { Menu } from "lucide-react";

export default function Room() {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const playerRef = useRef<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const { user, users, videoState, chat, updateName } = useRoom(roomId);
    const { play, pause, seek, skip, onEnded, addVideo, removeVideo } = useVideo(roomId);
    const { sendMessage } = useChat(roomId);

    return (
        <div className="h-screen bg-[var(--bg-base)] flex flex-col overflow-hidden text-white">
            {/* HEADER */}
            <header className="flex items-center justify-between px-4 h-14 border-b border-[var(--border-default)] backdrop-blur-md bg-black/40">
                {/* LEFT */}
                <div className="flex items-center gap-4">
                    <Logo size="md" />

                    <div className="w-px h-4 bg-[var(--border-default)]" />

                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {users.length} na sala
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate("/")}
                        className="px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-white transition"
                    >
                        Sair
                    </button>

                    <button
                        onClick={() => setSidebarOpen((v) => !v)}
                        className={`
w-9 h-9 rounded-lg flex items-center justify-center transition
${sidebarOpen ? "bg-[var(--bg-card)] text-white" : "text-[var(--text-secondary)] hover:text-white"}
`}
                    >
                        <Menu size={16} />
                    </button>
                </div>
            </header>

            {/* CONTENT */}
            <div className="flex flex-1 overflow-hidden">
                {/* PLAYER */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 bg-black relative overflow-hidden">
                        {/* glow leve atrás */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-orange-400/10 pointer-events-none" />

                        <VideoPlayer
                            videoState={videoState}
                            playerRef={playerRef}
                            onPlay={play}
                            onPause={pause}
                            onSeek={seek}
                            onEnded={onEnded}
                        />
                    </div>

                    {/* CONTROLS */}
                    <div className="bg-[var(--bg-surface)] border-t border-[var(--border-default)] p-3">
                        <VideoControls
                            videoState={videoState}
                            playerRef={playerRef}
                            onPlay={play}
                            onPause={pause}
                            onSeek={seek}
                            onSkip={skip}
                        />
                    </div>
                </div>

                {/* SIDEBAR */}
                <div
                    className={`
transition-all duration-300 overflow-hidden
${sidebarOpen ? "w-80" : "w-0"}
`}
                >
                    <div className="w-80 h-full border-l border-[var(--border-default)] bg-[var(--bg-card)]">
                        <Sidebar
                            roomId={roomId!}
                            currentUser={user}
                            users={users}
                            videoState={videoState}
                            chat={chat}
                            onUpdateName={updateName}
                            onAddVideo={addVideo}
                            onRemoveVideo={removeVideo}
                            onSkip={skip}
                            onSendMessage={sendMessage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
