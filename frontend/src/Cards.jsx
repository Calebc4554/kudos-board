import React from "react";
import "./Cards.css";

function BoardDetails({ board, onDeleteCard, onUpvoteCard }) {
	if (!board?.cards?.length) return <p className="no-cards">No cards to display</p>;

	return (
		<div className="cards-container">
			{board.cards.map((card) => (
				<div key={card.id} className="card">
					<img src={card.gif} alt={card.title} className="card-gif" />
					<h3>{card.title}</h3>
					<p>{card.description}</p>
					<p className="card-author">
						<strong>By:</strong> {card.author}
					</p>
					<div className="card-actions">
						<button className="upvote-button" onClick={() => onUpvoteCard(card.id)}>
							❤️ {card.votes ?? 0}
						</button>
						<button className="delete-button" onClick={() => onDeleteCard(card.id)}>
							Delete
						</button>
					</div>
				</div>
			))}
		</div>
	);
}

export default BoardDetails;
