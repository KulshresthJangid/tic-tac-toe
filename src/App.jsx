import Player from './components/Player';
import Gameboard from './components/Gameboard';
import Log from './components/Log';
import { useState } from 'react';

function App() {
    const [gameTurns, setGameTurns] = useState([]);
    const [activePlayer, setActivePlayer] = useState('X');

    function handleSelectSquare(rowIndex, colIndex) {
        setActivePlayer((activePlayer) => (activePlayer === 'X' ? 'O' : 'X'));
        setGameTurns((prevTurns) => {
            let currentPlayer = 'X';
            if (prevTurns.length > 0 && prevTurns[0].player === 'X') {
                currentPlayer = 'O';
            }
            let updatedTurns = [
                {
                    square: { row: rowIndex, col: colIndex },
                    player: currentPlayer,
                },
                ...prevTurns,
            ];
            return updatedTurns;
        });
    }
    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    <Player
                        name={'Player1'}
                        symbol={'X'}
                        isActive={activePlayer === 'X'}
                    />
                    <Player
                        name={'Player2'}
                        symbol={'O'}
                        isActive={activePlayer === 'O'}
                    />
                </ol>
                <Gameboard
                    onSelectSquare={handleSelectSquare}
                    turns={gameTurns}
                />
            </div>
        </main>
    );
}

export default App;
