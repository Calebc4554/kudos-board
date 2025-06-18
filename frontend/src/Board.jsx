import React from "react";
import "./Board.css";

function Board({ board, onDelete }) {
	return (
		<div className="board-item">
			<img src={board.image} alt={board.title} className="board-image" />
			<h3>{board.title}</h3>
			<p>{board.description}</p>
			<p className="author">By {board.author}</p>
			{board.id !== 0 && (
				<button className="delete-button" onClick={() => onDelete(board.id)}>
					Delete
				</button>
			)}
		</div>
	);
}

export default Board;
