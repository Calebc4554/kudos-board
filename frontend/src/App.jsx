// src/App.jsx
import React, { useState } from "react";
import "./App.css";
import BoardList from "./BoardList";
import Cards from "./Cards";
import CreateBoardModal from "./CreateBoardModal";
import CreateCardModal from "./CreateCardModal";

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
	const [showCardModal, setShowCardModal] = useState(false);
	const [cardFormData, setCardFormData] = useState({
		title: "",
		description: "",
		gif: "",
		author: "",
	});

	// Sample default board with cards
	const defaultBoard = {
		id: 0,
		title: "Welcome to Kudos Board",
		image: "https://picsum.photos/seed/picsum/600/400",
		description: "Start celebrating your teammates by creating a board!",
		author: "Admin",
		category: "inspiration",
		cards: [
			{
				id: "c1",
				title: "First Kudos",
				description: "You nailed that presentation!",
				author: "Admin",
				gif: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
				votes: 0,
			},
			{
				id: "c2",
				title: "Team Player",
				description: "Thanks for helping onboard our new teammate.",
				author: "Admin",
				gif: "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif",
				votes: 0,
			},
			{
				id: "c3",
				title: "Deadline Crusher",
				description: "Pulled through on that tight deadline, legendary work!",
				author: "Admin",
				gif: "https://media.giphy.com/media/l0HlOvJ7yaacpuSas/giphy.gif",
				votes: 0,
			},
		],
	};

	const [boards, setBoards] = useState([]);
	const [selectedBoard, setSelectedBoard] = useState(null);
	const [showDetails, setShowDetails] = useState(false);

	const handleAddCard = (boardId, newCardData) => {
		const newCard = {
			id: Date.now().toString(),
			votes: 0,
			...newCardData,
		};
		const updated = {
			...selectedBoard,
			cards: [...(selectedBoard.cards || []), newCard],
		};
		setSelectedBoard(updated);
		setBoards((bs) => bs.map((b) => (b.id === boardId ? updated : b)));
	};

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
		setBoards(boards.filter((b) => b.id !== id));
	};

	const updateBoardCards = (updatedCards) => {
		const updated = { ...selectedBoard, cards: updatedCards };
		setSelectedBoard(updated);
		setBoards((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
	};

	const handleDeleteCard = (cardId) => {
		const remaining = (selectedBoard.cards || []).filter((c) => c.id !== cardId);
		updateBoardCards(remaining);
	};

	const handleUpvoteCard = (cardId) => {
		const voted = (selectedBoard.cards || []).map((c) =>
			c.id === cardId ? { ...c, votes: (c.votes || 0) + 1 } : c
		);
		updateBoardCards(voted);
	};

	const filteredBoards = filter === "all" ? boards : boards.filter((b) => b.category === filter);
	const displayBoards = boards.length ? filteredBoards : [defaultBoard];

	return (
		<div className="app">
			<header className="header">
				<h1>Kudos Board</h1>
				{showDetails && (
					<>
						<button className="back-button" onClick={handleBack}>
							← Back to Boards
						</button>
						<button className="create-card-button" onClick={() => setShowCardModal(true)}>
							+ Add Card
						</button>
					</>
				)}
			</header>

			{showDetails ? (
				<Cards
					board={selectedBoard}
					onDeleteCard={handleDeleteCard}
					onUpvoteCard={handleUpvoteCard}
				/>
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
				<CreateBoardModal
					formData={formData}
					setFormData={setFormData}
					onClose={() => setShowForm(false)}
					onSubmit={handleCreateBoard}
				/>
			)}

			{showCardModal && (
				<CreateCardModal
					formData={cardFormData}
					setFormData={setCardFormData}
					onClose={() => {
						setShowCardModal(false);
						setCardFormData({ title: "", description: "", gif: "", author: "" });
					}}
					onSubmit={(e) => {
						e.preventDefault();
						handleAddCard(selectedBoard.id, cardFormData);
						setShowCardModal(false);
						setCardFormData({ title: "", description: "", gif: "", author: "" });
					}}
				/>
			)}
		</div>
	);
}

export default App;
