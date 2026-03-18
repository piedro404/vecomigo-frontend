import type { VideoState, Video } from "@app-types/modules/video.types"
import type { User } from "@app-types/modules/user.types"

type Props = {
    videoState: VideoState | null
    currentUser: User
    onAddVideo: (video: any, playNow?: boolean) => void
    onRemoveVideo: (videoId: string) => void
    onSkip: () => void
}

function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/)
    return match?.[1] ?? null
}

import { useState } from "react"

export function PlaylistTab({ videoState, currentUser, onAddVideo, onRemoveVideo, onSkip }: Props) {
    const [videoUrl, setVideoUrl] = useState("")

    const handleAdd = (playNow: boolean) => {
        const ytId = getYouTubeId(videoUrl)
        if (!ytId) return
        onAddVideo({ id: crypto.randomUUID(), youtubeId: ytId, title: `YouTube - ${ytId}`, addedBy: currentUser.id }, playNow)
        setVideoUrl("")
    }

    return (
        <div className="flex flex-col">
            {/* Input */}
            <div className="p-4 border-b border-[#1a1a1a] flex flex-col gap-3">
                <input
                    className="w-full bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#333] transition-colors"
                    placeholder="Cole o link do YouTube..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd(false)}
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => handleAdd(false)}
                        disabled={!getYouTubeId(videoUrl)}
                        className="flex-1 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#aaa] hover:text-white text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        + Fila
                    </button>
                    <button
                        onClick={() => handleAdd(true)}
                        disabled={!getYouTubeId(videoUrl)}
                        className="flex-1 py-2 rounded-lg bg-[#e63946]/10 hover:bg-[#e63946]/20 text-[#e63946] text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-[#e63946]/20"
                    >
                        ▶ Tocar agora
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col">
                {!videoState?.playlist?.length ? (
                    <div className="flex flex-col items-center gap-2 py-10 px-4">
                        <p className="text-[#333] text-sm">Fila vazia</p>
                        <p className="text-[#252525] text-xs text-center">Cole um link do YouTube acima</p>
                    </div>
                ) : (
                    videoState.playlist.map((video, i) => (
                        <VideoItem
                            key={video.id}
                            video={video}
                            isFirst={i === 0}
                            onSkip={onSkip}
                            onRemove={() => onRemoveVideo(video.id)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

type VideoItemProps = {
    video: Video
    isFirst: boolean
    onSkip: () => void
    onRemove: () => void
}

function VideoItem({ video, isFirst, onSkip, onRemove }: VideoItemProps) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 group border-b border-[#111] transition-colors ${isFirst ? "bg-[#141414]" : "hover:bg-[#0f0f0f]"}`}>
            <div className="relative w-16 h-9 rounded overflow-hidden flex-shrink-0 bg-[#1a1a1a]">
                <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                />
                {isFirst && (
                    <div className="absolute inset-0 bg-[#e63946]/40 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className={`text-xs truncate ${isFirst ? "text-white" : "text-[#666]"}`}>
                    {video.title}
                </p>
                {isFirst && (
                    <span className="text-[10px] text-[#e63946] font-medium">Tocando agora</span>
                )}
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isFirst && (
                    <button
                        onClick={onSkip}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#555] hover:text-white hover:bg-[#222] transition-all"
                        title="Pular"
                    >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
                        </svg>
                    </button>
                )}
                <button
                    onClick={onRemove}
                    className="w-6 h-6 rounded flex items-center justify-center text-[#555] hover:text-[#e63946] hover:bg-[#1a1a1a] transition-all"
                    title="Remover"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    )
}