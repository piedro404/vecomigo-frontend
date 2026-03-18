import { useState, useRef, useCallback, useEffect } from "react"
import { Play, Pause, SkipForward } from "lucide-react"
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
    const [playerDuration, setPlayerDuration] = useState(0)
    const [playerCurrentTime, setPlayerCurrentTime] = useState(0)
    const progressRef = useRef<HTMLDivElement>(null)
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const currentVideo = videoState?.playlist[0]
    const isPlaying = videoState?.isPlaying ?? false
    const hasVideo = !!currentVideo

    // Lê duração e tempo atual diretamente do player em tempo real
    useEffect(() => {
        if (tickRef.current) clearInterval(tickRef.current)

        tickRef.current = setInterval(() => {
            const player = playerRef.current
            if (!player) return

            const dur = player.getDuration?.() ?? 0
            const cur = player.getCurrentTime?.() ?? 0

            if (dur > 0) setPlayerDuration(dur)
            if (!isDragging) setPlayerCurrentTime(cur)
        }, 250)

        return () => {
            if (tickRef.current) clearInterval(tickRef.current)
        }
    }, [playerRef, isDragging])

    const duration = playerDuration
    const currentTime = isDragging ? dragValue : playerCurrentTime
    const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

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
        const time = getTimeFromEvent(e)
        setIsDragging(false)
        setPlayerCurrentTime(time)
        onSeek(time)
    }

    const togglePlay = () => {
        const t = playerRef.current?.getCurrentTime?.() ?? 0
        if (isPlaying) onPause(t)
        else onPlay(t)
    }

    return (
        <div className="w-full flex flex-col gap-3 px-4 pb-4">
            {/* Progress bar */}
            <div
                ref={progressRef}
                className={`w-full h-1 rounded-full relative group ${hasVideo ? "cursor-pointer" : "cursor-default opacity-30"}`}
                style={{ background: "var(--bg-elevated)" }}
                onMouseDown={hasVideo ? handleMouseDown : undefined}
                onMouseMove={hasVideo ? handleMouseMove : undefined}
                onMouseUp={hasVideo ? handleMouseUp : undefined}
                onMouseLeave={hasVideo && isDragging ? handleMouseUp : undefined}
            >
                <div
                    className="h-full rounded-full relative transition-[width] duration-100"
                    style={{ width: `${progress}%`, background: "var(--accent-red)" }}
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
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ background: "var(--bg-elevated)", color: "var(--text-primary)" }}
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} className="translate-x-[1px]" />}
                    </button>

                    {/* Skip */}
                    <button
                        onClick={onSkip}
                        disabled={!hasVideo}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
                        title="Pular vídeo"
                    >
                        <SkipForward size={16} />
                    </button>

                    {/* Time */}
                    <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                        {formatTime(currentTime)}
                        {duration > 0 && (
                            <span style={{ color: "var(--text-muted)" }}> / {formatTime(duration)}</span>
                        )}
                    </span>
                </div>

                {currentVideo && (
                    <p className="text-xs truncate max-w-[200px]" style={{ color: "var(--text-muted)" }} title={currentVideo.title}>
                        {currentVideo.title}
                    </p>
                )}
            </div>
        </div>
    )
}