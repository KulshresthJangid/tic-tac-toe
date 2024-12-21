import Player from './components/Player';
import Gameboard from './components/Gameboard';

function App() {
    return (
        <main>
            <div id="game-container">
                <ol id="players">
                    <Player name={'Player1'} symbol={'X'} />
                    <Player name={'Player2'} symbol={'O'} />
                </ol>
                <Gameboard />
            </div>
        </main>
    );
}

export default App;
