import { useState, useRef, useCallback } from "react"
import type { VideoState } from "@app-types/modules/video.types"

type Props = {
    videoState: VideoState | null
    playerRef: React.MutableRefObject<any>
    onPlay: (currentTime: number) => void
    onPause: (currentTime: number) => void
    onSeek: (currentTime: number) => void
    onSkip: () => void
}

function formatTime(seconds: number): string {
    const s = Math.floor(seconds)
    const m = Math.floor(s / 60)
    const h = Math.floor(m / 60)
    if (h > 0) return `${h}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
    return `${m}:${String(s % 60).padStart(2, "0")}`
}

export function VideoControls({ videoState, playerRef, onPlay, onPause, onSeek, onSkip }: Props) {
    const [isDragging, setIsDragging] = useState(false)
    const [dragValue, setDragValue] = useState(0)
    const progressRef = useRef<HTMLDivElement>(null)

    const currentVideo = videoState?.playlist[0]
    const duration = currentVideo?.duration ?? 0
    const currentTime = isDragging ? dragValue : (videoState?.currentTime ?? 0)
    const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0
    const isPlaying = videoState?.isPlaying ?? false
    const hasVideo = !!currentVideo

    const getTimeFromEvent = useCallback((e: React.MouseEvent) => {
        const rect = progressRef.current?.getBoundingClientRect()
        if (!rect || duration === 0) return 0
        return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration
    }, [duration])

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragValue(getTimeFromEvent(e))
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        setDragValue(getTimeFromEvent(e))
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return
        setIsDragging(false)
        onSeek(getTimeFromEvent(e))
    }

    const togglePlay = () => {
        const t = playerRef.current?.getCurrentTime?.() ?? videoState?.currentTime ?? 0
        if (isPlaying) onPause(t)
        else onPlay(t)
    }

    return (
        <div className="w-full flex flex-col gap-3 px-4 pb-4">
            {/* Progress bar */}
            <div
                ref={progressRef}
                className={`w-full h-1 bg-[#222] rounded-full relative group ${hasVideo ? "cursor-pointer" : "cursor-default opacity-40"}`}
                onMouseDown={hasVideo ? handleMouseDown : undefined}
                onMouseMove={hasVideo ? handleMouseMove : undefined}
                onMouseUp={hasVideo ? handleMouseUp : undefined}
                onMouseLeave={hasVideo && isDragging ? handleMouseUp : undefined}
            >
                <div
                    className="h-full bg-[#e63946] rounded-full transition-[width] duration-100 relative"
                    style={{ width: `${progress}%` }}
                >
                    {hasVideo && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        disabled={!hasVideo}
                        className="w-9 h-9 rounded-lg bg-[#1a1a1a] hover:bg-[#e63946] text-white flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {isPlaying ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>

                    {/* Skip */}
                    <button
                        onClick={onSkip}
                        disabled={!hasVideo}
                        className="w-9 h-9 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#666] hover:text-white flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Pular vídeo"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
                        </svg>
                    </button>

                    {/* Time */}
                    <span className="text-[#555] text-xs tabular-nums">
                        {formatTime(currentTime)}
                        {duration > 0 && <span className="text-[#333]"> / {formatTime(duration)}</span>}
                    </span>
                </div>

                {currentVideo && (
                    <p className="text-[#444] text-xs truncate max-w-[200px]" title={currentVideo.title}>
                        {currentVideo.title}
                    </p>
                )}
            </div>
        </div>
    )
}