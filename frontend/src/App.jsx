import React from "react";
import "./App.css";

function App() {
	// Sample Data for now
	const boards = [
		{ id: 1, title: "Engineering Kudos" },
		{ id: 2, title: "Product Shoutouts" },
		{ id: 3, title: "Design Highlights" },
	];

	return (
		<div className="app">
			<header className="header">
				<h1>Kudos Board</h1>
			</header>

			<div className="search-container">
				<input type="text" placeholder="Search boards..." className="search-input" disabled />
			</div>

			<section className="board-list">
				{boards.map((board) => (
					<div key={board.id} className="board-item">
						{board.title}
					</div>
				))}
			</section>

			<footer className="footer">
				<p>&copy; 2025 Kudos Board. All rights reserved. Caleb Calderon.</p>
			</footer>
		</div>
	);
}

export default App;
