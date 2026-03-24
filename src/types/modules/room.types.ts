import type { User } from "@app-types/modules/user.types";
import type { Video } from "@app-types/modules/video.types";
import type { Chat } from "@app-types/modules/chat.types";

export enum RoomStatus {
    WAITING = "WAITING",
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
}

export type Room = {
    id: string;
    users: Map<string, User>;
    playlist: Video[];
    chat: Chat[];
    currentTime: number;
    isPlaying: boolean;
    lastUpdate: number;
    status: RoomStatus;
    createdAt: Date;
}
