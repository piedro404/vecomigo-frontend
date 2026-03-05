import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { socket } from "../socket";
import { getOrCreateUser, updateStoredUser } from "../utils/user";

export default function Room() {
    const { roomId } = useParams();
    const [user, setUser] = useState(getOrCreateUser());

    const [users, setUsers] = useState<any[]>([]);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        socket.emit("join-room", { roomId, user });

        socket.on("room-updated", (data) => {
            setUsers(data.users);
        });

        socket.on("room-closed", () => {
            alert("Sala foi fechada");
        });

        return () => {
            socket.emit("leave-room", { roomId, userId: user.id });
            socket.off("room-updated");
            socket.off("room-closed");
        };
    }, [roomId]);

    const changeName = () => {
        const updatedUser = { ...user, name: newName };

        setUser(updatedUser);
        updateStoredUser(updatedUser);

        socket.emit("update-user", {
            roomId,
            user: updatedUser,
        });
    };

    const inviteLink = `${window.location.origin}/room/${roomId}`;

    return (
        <div>
            <h1>Sala {roomId}</h1>

            <p>Link de convite:</p>
            <input value={inviteLink} readOnly style={{ width: 400 }} />

            <h2>Trocar nome</h2>
            <input
                placeholder="Novo nome"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
            <button onClick={changeName}>Salvar</button>

            <h2>Usuários</h2>
            <ul>
                {users.map((u) => (
                    <li key={u.id}>{u.name}</li>
                ))}
            </ul>
        </div>
    );
}

function generateGuestName() {
    return `User-${Math.floor(Math.random() * 1000)}`;
}
