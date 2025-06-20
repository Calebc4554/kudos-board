import React from "react";
import "./Board.css";

function Board({ board, onDelete, onView }) {
	return (
		<div className="board-item">
			<img src={board.image || board.image_url} alt={board.title} className="board-image" />
			<h3>{board.title}</h3>
			<p>{board.description}</p>
			<p className="author">By {board.author}</p>
			<div className="board-actions">
				<button className="view-button" onClick={() => onView(board)}>
					View
				</button>

				{board.id !== 0 && (
					<button className="delete-button" onClick={() => onDelete(board.id)}>
						Delete
					</button>
				)}
			</div>
		</div>
	);
}

export default Board;
