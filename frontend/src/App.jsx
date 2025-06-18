import React from "react";
import "./App.css";
import BoardList from "./BoardList";
import Modal from "./Modal";
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

	const [boards, setBoards] = useState([]);

	const handleCreateBoard = (e) => {
		e.preventDefault();
		const newBoard = {
			id: Date.now(),
			...formData,
			author: formData.author || "Anonymous",
		};
		setBoards([newBoard, ...boards]);
		setShowForm(false);
		setFormData({ title: "", description: "", category: "celebration", image: "", author: "" });
	};

	const handleDeleteBoard = (id) => {
		setBoards(boards.filter((board) => board.id !== id));
	};

	const filteredBoards =
		filter === "all" ? boards : boards.filter((board) => board.category === filter);

	const displayBoards = boards.length > 0 ? filteredBoards : [defaultBoard];

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

			<BoardList boards={displayBoards} onDelete={handleDeleteBoard} />

			<footer className="footer">
				<p>&copy; 2025 Kudos Board. All rights reserved.</p>
			</footer>

			{showForm && (
				<Modal
					formData={formData}
					setFormData={setFormData}
					onClose={() => setShowForm(false)}
					onSubmit={handleCreateBoard}
				/>
			)}
		</div>
	);
}

export default App;
