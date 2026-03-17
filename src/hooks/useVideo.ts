import type { Video } from "@app-types/modules/video.types";
import { useCallback, useRef } from "react";
import { socket } from "src/socket";

export function useVideo(roomId: string | undefined) {
    const endedLock = useRef(false);

    const play = useCallback((currentTime?: number) => {
        socket.emit("video:play", { roomId, currentTime });
    }, [roomId]);

    const pause = useCallback((currentTime?: number) => {
        socket.emit("video:pause", { roomId, currentTime })
    }, [roomId])

    const seek = useCallback((currentTime: number) => {
        socket.emit("video:seek", { roomId, currentTime })
    }, [roomId])

    const skip = useCallback(() => {
        socket.emit("video:skip", { roomId })
    }, [roomId])

    const onEnded = useCallback(() => {
        if (endedLock.current) return
        endedLock.current = true

        socket.emit("video:ended", { roomId })

        setTimeout(() => {
            endedLock.current = false
        }, 2000)
    }, [roomId])

    const addVideo = useCallback((video: Video, playNow = false) => {
        socket.emit("video:add", { roomId, video, playNow })
    }, [roomId])

    const removeVideo = useCallback((videoId: string) => {
        socket.emit("video:remove", { roomId, videoId })
    }, [roomId])

    const syncRequest = useCallback(() => {
        socket.emit("video:sync-request", { roomId })
    }, [roomId])

    return { play, pause, seek, skip, onEnded, addVideo, removeVideo, syncRequest }
}