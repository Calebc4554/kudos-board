import React from "react";
import Board from "./Board";

function BoardList({ boards = [], onDelete }) {
	return (
		<section className="board-list">
			{boards.map((board) => (
				<Board key={board.id} board={board} onDelete={onDelete} />
			))}
		</section>
	);
}

export default BoardList;
