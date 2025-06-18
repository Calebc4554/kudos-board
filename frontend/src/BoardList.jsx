import React from "react";
import Board from "./Board";

function BoardList({ boards = [], onDelete, onView }) {
	return (
		<section className="board-list">
			{boards.map((board) => (
				<Board key={board.id} board={board} onDelete={onDelete} onView={onView} />
			))}
		</section>
	);
}

export default BoardList;
