import type { User } from "@app-types/user.types";
import type { Video } from "@app-types/video.types";

export enum RoomStatus {
    WAITING = "WAITING",
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
}

export type Room = {
    id: string;
    users: Map<string, User>;
    playlist: Video[];
    currentTime: number;
    isPlaying: boolean;
    lastUpdate: number;
    status: RoomStatus;
    createdAt: Date;
}
