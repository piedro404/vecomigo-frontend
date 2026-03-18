import { useState } from "react";
import { SkipForward, X, Play, Plus } from "lucide-react";
import type { VideoState, Video } from "@app-types/modules/video.types";
import type { User } from "@app-types/modules/user.types";

type Props = {
    videoState: VideoState | null;
    currentUser: User;
    onAddVideo: (video: any, playNow?: boolean) => void;
    onRemoveVideo: (videoId: string) => void;
    onSkip: () => void;
};

function getYouTubeId(url: string): string | null {
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/,
    );
    return match?.[1] ?? null;
}

export function PlaylistTab({
    videoState,
    currentUser,
    onAddVideo,
    onRemoveVideo,
    onSkip,
}: Props) {
    const [videoUrl, setVideoUrl] = useState("");

    const handleAdd = (playNow: boolean) => {
        const ytId = getYouTubeId(videoUrl);
        if (!ytId) return;
        onAddVideo(
            {
                id: crypto.randomUUID(),
                youtubeId: ytId,
                title: `YouTube - ${ytId}`,
                addedBy: currentUser.id,
            },
            playNow,
        );
        setVideoUrl("");
    };

    return (
        <div className="flex flex-col">
            {/* Input */}
            <div
                className="p-4 flex flex-col gap-3"
                style={{ borderBottom: "1px solid var(--border-default)" }}
            >
                <input
                    className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                    style={{
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-default)",
                        color: "var(--text-primary)",
                    }}
                    placeholder="Cole o link do YouTube..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd(false)}
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => handleAdd(false)}
                        disabled={!getYouTubeId(videoUrl)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                            background: "var(--bg-card)",
                            color: "var(--text-soft)",
                        }}
                    >
                        <Plus size={12} />
                        Fila
                    </button>
                    <button
                        onClick={() => handleAdd(true)}
                        disabled={!getYouTubeId(videoUrl)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                            background: "rgba(230,57,70,0.1)",
                            color: "var(--accent-red)",
                            border: "1px solid rgba(230,57,70,0.2)",
                        }}
                    >
                        <Play size={12} />
                        Tocar agora
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col">
                {!videoState?.playlist?.length ? (
                    <div className="flex flex-col items-center py-10">
                        <p
                            className="text-sm"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Fila vazia
                        </p>
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
    );
}

type VideoItemProps = {
    video: Video;
    isFirst: boolean;
    onSkip: () => void;
    onRemove: () => void;
};

function VideoItem({ video, isFirst, onSkip, onRemove }: VideoItemProps) {
    return (
        <div
            className="flex items-center gap-3 px-4 py-3 group border-b transition-colors"
            style={{
                background: isFirst ? "var(--bg-input)" : undefined,
                borderColor: "var(--bg-card)",
            }}
        >
            <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                alt={video.title}
                className="w-16 h-9 rounded object-cover flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <p
                    className="text-xs truncate"
                    style={{
                        color: isFirst
                            ? "var(--text-primary)"
                            : "var(--text-soft)",
                    }}
                >
                    {video.title}
                </p>
                {isFirst && (
                    <span
                        className="text-[10px] font-medium"
                        style={{ color: "var(--accent-red)" }}
                    >
                        Tocando agora
                    </span>
                )}
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isFirst && (
                    <button
                        onClick={onSkip}
                        className="w-6 h-6 rounded flex items-center justify-center transition-all"
                        style={{ color: "var(--text-muted)" }}
                        title="Pular"
                    >
                        <SkipForward size={14} />
                    </button>
                )}
                <button
                    onClick={onRemove}
                    className="w-6 h-6 rounded flex items-center justify-center transition-all"
                    style={{ color: "var(--text-muted)" }}
                    title="Remover"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
