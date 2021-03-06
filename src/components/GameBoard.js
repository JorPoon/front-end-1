import React, { useState, useEffect, useRef, useCallback } from 'react';
import Tile from './Tile';
import Player from './Player';

function GameBoard() {
	const boardWidth = 32;
	const boardHeight = 32;
	const [board, setBoard] = useState(null);
	const [playerX, setPlayerX] = useState(null);
	const [playerY, setPlayerY] = useState(null);

	const roomSizes = [
		{ width: 16, height: 16 },
		{ width: 16, height: 8 },
		{ width: 16, height: 8 },
		{ width: 8, height: 8 },
		{ width: 8, height: 8 },
	];

	const generateRooms = useCallback(() => {
		const tempBoard = [];
		// height
		for (let i = 0; i < boardHeight; i++) {
			const row = [];

			for (let j = 0; j < boardWidth; j++) {
				row.push(null);
			}
			tempBoard.push(row);
		}
		const wall = {
			wall: true,
		};

		// populating board
		let w, h, xLoc, yLoc;
		for (let roomSize of roomSizes) {
			do {
				w = roomSize.width;
				h = roomSize.height;
				let xNumber = boardWidth / w;
				let yNumber = boardHeight / h;

				xLoc = Math.floor(Math.random() * xNumber) * w;

				yLoc = Math.floor(Math.random() * yNumber) * h;
			} while (boardHasConflict(tempBoard, xLoc, yLoc, w, h));

			for (let i = yLoc; i < yLoc + h; i++) {
				for (let j = xLoc; j < xLoc + w; j++) {
					tempBoard[i][j] = wall;
				}
			}
		}
		// place player
		do {
			xLoc = Math.floor(Math.random() * boardWidth);
			yLoc = Math.floor(Math.random() * boardHeight);
		} while (boardHasConflict(tempBoard, xLoc, yLoc, 1, 1));

		setPlayerX(xLoc);
		setPlayerY(yLoc);

		setBoard(tempBoard);
	}, []);
	const savedListener = useRef();

	const keyDown = useCallback(
		(event) => {
			switch (event.key) {
				// move up
				case 'w':
					setPlayerY(playerY - 1);
					break;
				// move down
				case 's':
					setPlayerY(playerY + 1);
					break;
				// move left
				case 'a':
					setPlayerX(playerX - 1);
					break;
				// move right
				case 'd':
					setPlayerX(playerX + 1);
					break;
				default:
					break;
			}
		},
		[playerX, playerY],
	);

	useEffect(() => {
		generateRooms();
	}, [generateRooms]);

	useEffect(() => {
		window.removeEventListener('keydown', savedListener.current);
		savedListener.current = keyDown;
		window.addEventListener('keydown', keyDown);
	}, [playerX, playerY, keyDown]);

	function boardHasConflict(board, x, y, width, height) {
		for (let i = y; i < y + height; i++) {
			for (let j = x; j < x + width; j++) {
				if (board[i][j]) {
					return true;
				}
			}
		}
		return false;
	}

	return (
		<div className="game-board">
			<Player playerX={playerX} playerY={playerY} />
			{board?.map((row, indexY) => (
				<div className="board-row" key={indexY}>
					{row.map((tile, indexX) => (
						<Tile
							key={JSON.stringify({ indexX, indexY })}
							tileData={tile}
						/>
					))}
				</div>
			))}
		</div>
	);
}

export default GameBoard;
