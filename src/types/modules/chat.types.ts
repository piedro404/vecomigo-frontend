import type { User } from "@app-types/modules/user.types";

export type Chat = {
    id: string;
    user: User;
    message: string;
    createdAt: number;
};
