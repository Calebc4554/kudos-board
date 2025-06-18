import React from "react";
import "./App.css";

function App() {
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
				<h2>Celebrate your team 🎉</h2>
				<p>Create, filter, and manage your kudos boards below.</p>
				<button className="create-button">+ Create New Board</button>
			</section>

			<div className="filter-container">
				<button className="filter-button active">All</button>
			</div>

			<section className="board-list">
				<div className="board-item">
					<img src={defaultBoard.image} alt={defaultBoard.title} className="board-image" />
					<h3>{defaultBoard.title}</h3>
					<p>{defaultBoard.description}</p>
					<p className="author">By {defaultBoard.author}</p>
				</div>
			</section>

			<footer className="footer">
				<p>&copy; 2025 Kudos Board. All rights reserved.</p>
			</footer>
		</div>
	);
}

export default App;
