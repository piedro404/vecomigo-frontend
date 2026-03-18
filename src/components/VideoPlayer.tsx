import { useEffect, useRef, useCallback } from "react"
import type { VideoState } from "@app-types/modules/video.types"

declare global {
    interface Window {
        YT: any
        onYouTubeIframeAPIReady: () => void
    }
}

type Props = {
    videoState: VideoState | null
    playerRef: React.MutableRefObject<any>
    onPlay: (currentTime: number) => void
    onPause: (currentTime: number) => void
    onSeek: (currentTime: number) => void
    onEnded: () => void
}

const SYNC_THRESHOLD = 2

export function VideoPlayer({ videoState, playerRef, onPlay, onPause, onSeek, onEnded }: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const isRemoteAction = useRef(false)
    const lastVideoId = useRef<string | null>(null)
    const initialized = useRef(false)
    const isReady = useRef(false)
    const pendingState = useRef<VideoState | null>(null)

    const callbacksRef = useRef({ onPlay, onPause, onSeek, onEnded })
    useEffect(() => {
        callbacksRef.current = { onPlay, onPause, onSeek, onEnded }
    })

    const applyState = useCallback((state: VideoState) => {
        const player = playerRef.current
        if (!player || !isReady.current) {
            pendingState.current = state
            return
        }

        const currentVideo = state.playlist[0]

        if (!currentVideo) {
            lastVideoId.current = null
            player.stopVideo?.()
            return
        }

        isRemoteAction.current = true

        if (currentVideo.youtubeId !== lastVideoId.current) {
            lastVideoId.current = currentVideo.youtubeId
            if (state.isPlaying) {
                player.loadVideoById({ videoId: currentVideo.youtubeId, startSeconds: state.currentTime })
            } else {
                player.cueVideoById({ videoId: currentVideo.youtubeId, startSeconds: state.currentTime })
            }
        } else {
            const playerTime = player.getCurrentTime?.() ?? 0
            if (Math.abs(playerTime - state.currentTime) > SYNC_THRESHOLD) {
                player.seekTo(state.currentTime, true)
            }
            if (state.isPlaying) player.playVideo()
            else player.pauseVideo()
        }

        setTimeout(() => { isRemoteAction.current = false }, 600)
    }, [playerRef])

    useEffect(() => {
        const init = () => {
            if (initialized.current || !wrapperRef.current) return
            initialized.current = true

            const rect = wrapperRef.current.getBoundingClientRect()
            const playerDiv = document.createElement("div")
            wrapperRef.current.appendChild(playerDiv)

            playerRef.current = new window.YT.Player(playerDiv, {
                width: rect.width || window.innerWidth,
                height: rect.height || window.innerHeight,
                playerVars: { autoplay: 0, controls: 1, rel: 0, modestbranding: 1, iv_load_policy: 3, playsinline: 1 },
                events: {
                    onReady: () => {
                        isReady.current = true
                        if (pendingState.current) {
                            applyState(pendingState.current)
                            pendingState.current = null
                        }
                    },
                    onStateChange: (event: any) => {
                        if (isRemoteAction.current) return
                        const player = playerRef.current
                        if (!player) return
                        const currentTime = player.getCurrentTime?.() ?? 0
                        switch (event.data) {
                            case window.YT.PlayerState.PLAYING:
                                callbacksRef.current.onPlay(currentTime); break
                            case window.YT.PlayerState.PAUSED:
                                callbacksRef.current.onPause(currentTime); break
                            case window.YT.PlayerState.ENDED:
                                callbacksRef.current.onEnded(); break
                        }
                    },
                },
            })

            const ro = new ResizeObserver((entries) => {
                const { width, height } = entries[0].contentRect
                playerRef.current?.setSize?.(width, height)
            })
            ro.observe(wrapperRef.current)
            return () => ro.disconnect()
        }

        let cleanup: (() => void) | undefined

        if (window.YT?.Player) {
            cleanup = init()
        } else {
            const previous = window.onYouTubeIframeAPIReady
            window.onYouTubeIframeAPIReady = () => { previous?.(); cleanup = init() }
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const tag = document.createElement("script")
                tag.src = "https://www.youtube.com/iframe_api"
                document.head.appendChild(tag)
            }
        }

        return () => {
            cleanup?.()
            playerRef.current?.destroy()
            playerRef.current = null
            initialized.current = false
            isReady.current = false
            pendingState.current = null
            lastVideoId.current = null
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!videoState) return
        applyState(videoState)
    }, [videoState, applyState])

    const hasVideo = !!videoState?.playlist[0]

    return (
        <div className="w-full h-full relative bg-black">
            <div
                ref={wrapperRef}
                className="w-full h-full"
                style={{ visibility: hasVideo ? "visible" : "hidden", pointerEvents: hasVideo ? "auto" : "none" }}
            />
            {!hasVideo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0d0d0d]">
                    <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
                        <svg className="w-7 h-7 text-[#333]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <p className="text-[#444] text-sm">Nenhum vídeo na fila</p>
                    <p className="text-[#2a2a2a] text-xs">Adicione um link do YouTube na playlist</p>
                </div>
            )}
        </div>
    )
}