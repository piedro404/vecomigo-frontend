import type { Chat } from "@app-types/modules/chat.types";
import { socket } from "src/socket";

export function useChat(roomId: string | undefined) {
    const sendMessage = (message: Chat) => {
        if (!roomId) return;

        socket.emit("chat:message", { roomId, message });
    }

    return {
        sendMessage
    };
}