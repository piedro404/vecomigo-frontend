import type { User } from "@app-types/user.types";
import { getOrCreateUser, removeUser, saveUser } from "@utils/userStorage";
import { useState } from "react";

export function useUser() {
    const [user, setUser] = useState<User>(() => getOrCreateUser())

    function updateUser(data: Partial<User>) {
        const updatedUser = { ...user, ...data }
        saveUser(updatedUser)
        setUser(updatedUser)
    }

    function logout() {
        removeUser()
        setUser(getOrCreateUser())
    }

    return { user, updateUser, logout }
}