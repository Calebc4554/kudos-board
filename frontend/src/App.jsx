import React, { useState, useEffect } from "react";
import "./App.css";
import BoardList from "./BoardList";
import Cards from "./Cards";
import CreateBoardModal from "./CreateBoardModal";
import CreateCardModal from "./CreateCardModal";

const API = import.meta.env.VITE_API_BASE_URL;

export default function App() {
	const [showForm, setShowForm] = useState(false);
	const [showCardModal, setShowCardModal] = useState(false);
	const [showDetails, setShowDetails] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "celebration",
		image: "",
		author: "",
	});
	const [cardFormData, setCardFormData] = useState({
		title: "",
		description: "",
		gif: "",
		author: "",
	});

	const [boards, setBoards] = useState([]);
	const [selectedBoard, setSelectedBoard] = useState(null);
	const categories = ["all", "recent", "celebration", "thank you", "inspiration"];
	const [filter, setFilter] = useState("all");

	useEffect(() => {
		fetch(`${API}/boards`)
			.then((res) => res.json())
			.then(setBoards)
			.catch(console.error);
	}, []);

	const handleCreateBoard = async (e) => {
		e.preventDefault();
		const payload = {
			title: formData.title,
			description: formData.description,
			category: formData.category,
			image_url: formData.image,
			author: formData.author,
		};
		try {
			const res = await fetch(`${API}/boards`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const newBoard = await res.json();
			setBoards((prev) => [newBoard, ...prev]);
			setShowForm(false);
			setFormData({ title: "", description: "", category: "celebration", image: "", author: "" });
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeleteBoard = async (id) => {
		try {
			await fetch(`${API}/boards/${id}`, { method: "DELETE" });
			setBoards((prev) => prev.filter((b) => b.id !== id));
			handleBack();
		} catch (err) {
			console.error(err);
		}
	};

	const handleViewBoard = async (board) => {
		try {
			const res = await fetch(`${API}/boards/${board.id}/cards`);
			const cards = await res.json();
			setSelectedBoard({ ...board, cards });
			setShowDetails(true);
		} catch (err) {
			console.error(err);
		}
	};

	const handleBack = () => {
		setShowDetails(false);
		setSelectedBoard(null);
	};

	const handleAddCard = async (e) => {
		e.preventDefault();
		const payload = {
			title: cardFormData.title,
			description: cardFormData.description,
			gif_url: cardFormData.gif,
			author: cardFormData.author,
		};
		try {
			const res = await fetch(`${API}/boards/${selectedBoard.id}/cards`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const newCard = await res.json();
			// update selected board
			setSelectedBoard((prev) => ({ ...prev, cards: [newCard, ...prev.cards] }));
			setShowCardModal(false);
			setCardFormData({ title: "", description: "", gif: "", author: "" });
		} catch (err) {
			console.error(err);
		}
	};

	const handleUpvoteCard = async (cardId) => {
		try {
			const res = await fetch(`${API}/cards/${cardId}/vote`, { method: "PATCH" });
			const updated = await res.json();
			setSelectedBoard((prev) => ({
				...prev,
				cards: prev.cards.map((c) => (c.id === cardId ? updated : c)),
			}));
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeleteCard = async (cardId) => {
		try {
			await fetch(`${API}/cards/${cardId}`, { method: "DELETE" });
			setSelectedBoard((prev) => ({
				...prev,
				cards: prev.cards.filter((c) => c.id !== cardId),
			}));
		} catch (err) {
			console.error(err);
		}
	};

	const filteredBoards = filter === "all" ? boards : boards.filter((b) => b.category === filter);

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

					<BoardList
						boards={filteredBoards}
						onDelete={handleDeleteBoard}
						onView={handleViewBoard}
					/>
				</>
			)}

			<footer className="footer">
				<p>© 2025 Kudos Board. All rights reserved.</p>
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
					onClose={() => setShowCardModal(false)}
					onSubmit={handleAddCard}
				/>
			)}
		</div>
	);
}
