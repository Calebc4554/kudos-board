import React, { useState } from "react";
import "./App.css";
import BoardList from "./BoardList";
import BoardDetails from "./BoardDetails";
import Modal from "./Modal";

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
	const [selectedBoard, setSelectedBoard] = useState(null);
	const [showDetails, setShowDetails] = useState(false);

	const handleViewBoard = (board) => {
		setSelectedBoard(board);
		setShowDetails(true);
	};

	const handleBack = () => {
		setShowDetails(false);
		setSelectedBoard(null);
	};

	const handleCreateBoard = (e) => {
		e.preventDefault();
		const newBoard = {
			id: Date.now(),
			...formData,
			author: formData.author || "Anonymous",
		};
		setBoards([newBoard, ...boards]);
		setShowForm(false);
		setFormData({
			title: "",
			description: "",
			category: "celebration",
			image: "",
			author: "",
		});
	};

	const handleDeleteBoard = (id) => {
		setBoards(boards.filter((board) => board.id !== id));
	};

	const filteredBoards = filter === "all" ? boards : boards.filter((b) => b.category === filter);
	const displayBoards = boards.length ? filteredBoards : [defaultBoard];

	return (
		<div className="app">
			<header className="header">
				<h1>Kudos Board</h1>
				{showDetails && (
					<button className="back-button" onClick={handleBack}>
						← Back to Boards
					</button>
				)}
			</header>

			{showDetails ? (
				<BoardDetails board={selectedBoard} />
			) : (
				<>
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

					<BoardList boards={displayBoards} onDelete={handleDeleteBoard} onView={handleViewBoard} />
				</>
			)}

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
