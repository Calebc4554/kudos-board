import React from "react";

function BoardDetails({ board }) {
	if (!board) return <p>No board selected</p>;

	return (
		<div className="board-details">
			<h1>{board.title}</h1>
			<img src={board.image} alt={board.title} />
			<p>{board.description}</p>
			<p>
				<strong>By:</strong> {board.author}
			</p>
		</div>
	);
}

export default BoardDetails;
