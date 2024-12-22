import { useState } from 'react';

const initialGameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

export default function GameBoard() {
    const [gameBoard, setGameBoard] = useState(initialGameBoard);

    const handleSelectSquare = (rowIndex, colIndex) => {
        setGameBoard((prevGameBoard) => {
            let updatedArr = [
                ...prevGameBoard.map((innerArr) => [...innerArr]),
            ];
            updatedArr[rowIndex][colIndex] = 'X';
            return updatedArr;
        });
    };

    return (
        <ol id="game-board">
            {initialGameBoard.map((row, rowIndex) => (
                <li key={rowIndex}>
                    <ol>
                        {row.map((col, colIndex) => (
                            <li key={colIndex}>
                                <button
                                    onClick={() =>
                                        handleSelectSquare(rowIndex, colIndex)
                                    }
                                >
                                    {col}
                                </button>
                            </li>
                        ))}
                    </ol>
                </li>
            ))}
        </ol>
    );
}
