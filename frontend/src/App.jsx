import React from "react";
import "./App.css";
import { useState } from "react";

function App() {
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "celebration",
		image: "",
		author: "",
	});
	const categories = ["all", "recent", "celebration", "thank you", "inspiration"];
	const [filter, setFilter] = useState("all");

	const defaultBoard = {
		id: 0,
		title: "Welcome to Kudos Board",
		image: "https://picsum.photos/seed/picsum/200/300",
		description: "Start celebrating your teammates by creating a board!",
		author: "Admin",
		category: "inspiration",
	};

	return (
		<div className="app">
			<header className="header">
				<h1>Kudos Board</h1>
			</header>

			<section className="banner">
				<h2>Celebrate Your Team 🎉</h2>
				<p>Create, filter, and manage your kudos boards below.</p>
				<button className="create-button" onClick={() => setShowForm(true)}>
					+ Create New Board
				</button>
			</section>

			<nav className="filter-container">
				{categories.map((cat) => (
					<button
						key={cat}
						className={`filter-button ${filter === cat ? "active" : ""}`}
						onClick={() => setFilter(cat)}
					>
						{cat.charAt(0).toUpperCase() + cat.slice(1)}
					</button>
				))}
			</nav>

			<main className="board-list">
				<div className="board-item">
					<img src={defaultBoard.image} alt={defaultBoard.title} className="board-image" />
					<h3>{defaultBoard.title}</h3>
					<p>{defaultBoard.description}</p>
					<p className="author">By {defaultBoard.author}</p>
				</div>
			</main>

			<footer className="footer">
				<p>&copy; 2025 Kudos Board. All rights reserved.</p>
			</footer>

			{showForm && (
				<form className="modal-form" onSubmit={(e) => e.preventDefault()}>
					<h2>Create a New Board</h2>
					<input
						type="text"
						placeholder="Title"
						value={formData.title}
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
						required
					/>
					<textarea
						placeholder="Description"
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						required
					/>
					<select
						value={formData.category}
						onChange={(e) => setFormData({ ...formData, category: e.target.value })}
						required
					>
						<option value="celebration">Celebration</option>
						<option value="thank you">Thank You</option>
						<option value="inspiration">Inspiration</option>
						<option value="recent">Recent</option>
					</select>
					<input
						type="text"
						placeholder="Image URL"
						value={formData.image}
						onChange={(e) => setFormData({ ...formData, image: e.target.value })}
						required
					/>
					<input
						type="text"
						placeholder="Author (optional)"
						value={formData.author}
						onChange={(e) => setFormData({ ...formData, author: e.target.value })}
					/>
					<div className="modal-buttons">
						<button type="submit" className="create-button">
							Create
						</button>
						<button type="button" className="delete-button" onClick={() => setShowForm(false)}>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
}

export default App;
