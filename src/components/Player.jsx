import { useState } from 'react';

export default function Player({ name, symbol, isActive }) {
    const [isEditing, setPlayerEditing] = useState(false);
    const [playerName, setPlayerName] = useState(name);

    const handleEditing = () => setPlayerEditing((isEditing) => !isEditing);

    const handleChangeName = (event) => {
        setPlayerName(event.target.value);
    };

    let player;
    if (isEditing) {
        player = (
            <input
                type="text"
                value={playerName}
                required
                onChange={handleChangeName}
            />
        );
    } else {
        player = <span className="player-name">{playerName}</span>;
    }

    return (
        <li className={isActive ? 'active' : undefined}>
            <span className="player">
                {player}
                <span className="player-symbol">{symbol}</span>
            </span>
            <button onClick={handleEditing}>Edit</button>
        </li>
    );
}
