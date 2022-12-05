// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from "../utils";


function Board({squares, onSelectSquare}) {
    function renderSquare(i) {
        return (
            <button className="square" onClick={() => onSelectSquare(i)}>
                {squares[i]}
            </button>
        )
    }

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>

        </div>
    )
}

const initialHistory = [Array(9).fill(null)];

function Game() {
    const [history, setHistory] = useLocalStorageState('game:history', initialHistory);
    const [step, setStep] = useLocalStorageState('game:step', 0);

    const squares = history[step];
    const winner = calculateWinner(squares);
    const nextValue = calculateNextValue(squares);
    const status = calculateStatus(winner, squares, nextValue);

    function selectSquare(index) {
        if (winner || squares[index]) {
            return;
        }
        const copySquare = squares.slice();
        copySquare[index] = nextValue;
        const newHistory = history.slice(0, step + 1);
        setHistory([...newHistory, copySquare]);
        setStep(newHistory.length);
    }

    function restart() {
        setHistory(initialHistory);
        setStep(0)
    }

    const moves = history.map((squares, i) => {
        const currentStep = i === step;
        const description = `Go to ${i === 0 ? 'game start' : `move #${i}`} ${currentStep ? '(current)' : ''}`;
        return (<li key={`${i}-${squares[i]}`}>
            <button disabled={currentStep} onClick={() => setStep(i)}>
                {description}
            </button>
        </li>)
    });

    return (
        <div className="game">
            <div className="game-board">
                <button className="restart" onClick={restart}>
                    restart
                </button>
                <Board squares={squares} step={step} setHistory={setHistory} setStep={setStep} onReset={restart}
                       onSelectSquare={selectSquare}/>
            </div>

            <div className="history">
                <div className="status">
                    {status}
                </div>
                <ol>
                    {moves}
                </ol>
            </div>
        </div>
    )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
    return winner
        ? `Winner: ${winner}`
        : squares.every(Boolean)
            ? `Scratch: Cat's game`
            : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
    return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}

function App() {
    return <Game/>
}

export default App
