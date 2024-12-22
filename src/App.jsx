import Player from './components/Player';
import Gameboard from './components/Gameboard';
import { useState } from 'react';

function App() {
    const [activePlayer, setActivePlayer] = useState('X');
    return (
        <main>
            <div id="game-container">
                <ol id="players">
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
                <Gameboard />
            </div>
        </main>
    );
}

export default App;
