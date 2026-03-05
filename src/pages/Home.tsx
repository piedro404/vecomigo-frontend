import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { getOrCreateUser } from "../utils/user";

export default function Home() {
    const navigate = useNavigate();

    const createRoom = () => {
        const user = getOrCreateUser();

        socket.emit("create-room", { name: "Room", user }, (room: any) => {
            navigate(`/room/${room.id}`);
        });
    };

    return (
        <div>
            <h1>VeComigo</h1>
            <button onClick={createRoom}>Criar Sala</button>
        </div>
    );
}

function generateGuestName() {
    return `User-${Math.floor(Math.random() * 1000)}`;
}
