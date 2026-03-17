import type { User } from "@app-types/modules/user.types"

export function getOrCreateUser(): User {
    const storedUser = localStorage.getItem('vecomigo:user')

    if (storedUser) {
        return JSON.parse(storedUser)
    }

    const newUser: User = {
        id: crypto.randomUUID(),
        name: `User-${Math.floor(Math.random() * 1000)}`,
    }

    localStorage.setItem('vecomigo:user', JSON.stringify(newUser))

    return newUser
}

export function getStoredUser(): User | null {
    const stored = localStorage.getItem('vecomigo:user')
    return stored ? JSON.parse(stored) : null
}

export function saveUser(user: User): void {
    localStorage.setItem('vecomigo:user', JSON.stringify(user))
}

export function removeUser(): void {
    localStorage.removeItem('vecomigo:user')
}