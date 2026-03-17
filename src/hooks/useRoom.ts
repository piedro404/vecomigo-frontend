import { useNavigate } from "react-router-dom";
import { useUser } from "@hooks/useUser";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@app-types/modules/user.types";
import type { VideoState } from "@app-types/modules/video.types";
import { socket } from "src/socket";
import type { ApiResponse } from "@app-types/api.response";
import type { Room } from "@app-types/modules/room.types";

export function useRoom(roomId: string | undefined) {
    const navigate = useNavigate();
    const { user, updateUser } = useUser();
    const [users, setUsers] = useState<User[]>([]);
    const [videoState, setVideoState] = useState<VideoState | null>(null);

    useEffect(() => {
        if (!roomId) {
            navigate("/", { replace: true });
            return;
        }

        socket.emit(
            "join-room",
            { roomId, user },
            (
                response: ApiResponse<{
                    room: Room;
                    videoState: VideoState | undefined;
                }>,
            ) => {
                if (!response.status || !response.data) {
                    navigate("/", { replace: true });
                    return;
                }

                setUsers(Array.from(response.data.room.users.values()));
                setVideoState(response.data.videoState ?? null);
            },
        );

        socket.on("room-updated", (data: { users: User[] }) => {
            setUsers(data.users);

            if (data.users.length === 0) {
                navigate("/", { replace: true });
            }
        });

        socket.on("video-state-updated", (data: { videoState: VideoState }) => {
            setVideoState(data.videoState);
        });

        socket.on("room-closed", () => {
            navigate("/", { replace: true });
        });

        socket.on("playlist-ended", () => {
            setVideoState((prev) =>
                prev ? { ...prev, isPlaying: false } : prev,
            );
        });

        const handleBeforeUnload = () => {
            socket.emit("leave-room", { roomId, userId: user.id });
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            socket.emit("leave-room", { roomId, userId: user.id });
            socket.off("room-updated");
            socket.off("video-state-updated");
            socket.off("room-closed");
            socket.off("playlist-ended");
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [roomId]);

    const updateName = useCallback(
        (name: string) => {
            if (!name.trim()) return;

            updateUser({ name });
            socket.emit("update-user", { roomId, user: { ...user, name } });
        },
        [user, roomId],
    );

    const createRoom = useCallback(() => {
        socket.emit("create-room", { user }, (response: ApiResponse<Room>) => {
            if (!response.status || !response.data) return;
            navigate(`/room/${response.data.id}`);
        });
    }, [user]);

    return {
        user,
        users,
        videoState,
        updateName,
        createRoom,
    };
}
