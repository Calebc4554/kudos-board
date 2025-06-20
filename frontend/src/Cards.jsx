import React, { useState, useEffect } from "react";
import "./Cards.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Cards({ board, onUpvoteCard, onDeleteCard, onTogglePin }) {
	const [openCard, setOpenCard] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState({ message: "", author: "" });

	useEffect(() => {
		if (!openCard) return;
		fetch(`${API}/cards/${openCard.id}/comments`)
			.then((r) => r.json())
			.then(setComments)
			.catch(console.error);
	}, [openCard]);

	const handleAddComment = async (e) => {
		e.preventDefault();
		if (!newComment.message.trim()) return;
		const res = await fetch(`${API}/cards/${openCard.id}/comments`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newComment),
		});
		const created = await res.json();
		setComments((c) => [...c, created]);
		setNewComment({ message: "", author: "" });
	};

	if (!board?.cards?.length) return <p className="no-cards">No cards to display</p>;

	return (
		<>
			<div className="cards-container">
				{board.cards.map((c) => (
					<div key={c.id} className={`card${c.pinned_at ? " pinned" : ""}`}>
						<img src={c.gif || c.gif_url} alt={c.title} className="card-gif" />
						<h3>{c.title}</h3>
						<p>{c.description}</p>
						<p className="card-author">
							<strong>By:</strong> {c.author || "Anonymous"}
						</p>
						<div className="card-actions">
							<button onClick={() => onUpvoteCard(c.id)}>❤️ {c.votes ?? 0}</button>
							<button onClick={() => onDeleteCard(c.id)}>Delete</button>
							<button
								className={`pin-button ${c.pinned_at ? "pinned" : ""}`}
								onClick={() => onTogglePin(c.id)}
							>
								📌
							</button>
							<button className="view-comments-button" onClick={() => setOpenCard(c)}>
								💬 View Comments
							</button>
						</div>
					</div>
				))}
			</div>

			{openCard && (
				<div className="modal-overlay" onClick={() => setOpenCard(null)}>
					<div className="card-modal" onClick={(e) => e.stopPropagation()}>
						<button className="close-button" onClick={() => setOpenCard(null)}>
							×
						</button>

						<img
							src={openCard.gif || openCard.gif_url}
							alt={openCard.title}
							className="card-gif-large"
						/>
						<h2>{openCard.title}</h2>
						<p>{openCard.description}</p>
						<p className="card-author">
							<strong>By:</strong> {openCard.author || "Anonymous"}
						</p>

						<section className="comments-section">
							<h3>Comments</h3>
							{comments.length === 0 ? (
								<p>No comments yet.</p>
							) : (
								<ul>
									{comments.map((cmt) => (
										<li key={cmt.id}>
											<strong>{cmt.author || "Anonymous"}</strong>: {cmt.message}
										</li>
									))}
								</ul>
							)}

							<form onSubmit={handleAddComment} className="comment-form">
								<textarea
									value={newComment.message}
									onChange={(e) => setNewComment((n) => ({ ...n, message: e.target.value }))}
									placeholder="Your comment…"
									required
								/>
								<input
									type="text"
									value={newComment.author}
									onChange={(e) => setNewComment((n) => ({ ...n, author: e.target.value }))}
									placeholder="Author (optional)"
								/>
								<button type="submit" className="create-button">
									Add Comment
								</button>
							</form>
						</section>
					</div>
				</div>
			)}
		</>
	);
}
