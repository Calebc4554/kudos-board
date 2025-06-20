import React, { useState, useEffect } from "react";
import "./App.css";
import BoardList from "./BoardList";
import Cards from "./Cards";
import CreateBoardModal from "./CreateBoardModal";
import CreateCardModal from "./CreateCardModal";

const API = import.meta.env.VITE_API_BASE_URL;

export default function App() {
	const [boards, setBoards] = useState([]);
	const [selectedBoard, setSelectedBoard] = useState(null);
	const [filter, setFilter] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const [showForm, setShowForm] = useState(false);
	const [showCardModal, setShowCardModal] = useState(false);

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

	const categories = ["all", "recent", "celebration", "thank you", "inspiration"];

	useEffect(() => {
		fetch(`${API}/boards`)
			.then((res) => res.json())
			.then(setBoards)
			.catch((err) => console.error("GET /boards failed:", err));
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
			console.error("POST /boards failed:", err);
		}
	};

	const handleDeleteBoard = async (id) => {
		try {
			await fetch(`${API}/boards/${id}`, { method: "DELETE" });
			setBoards((prev) => prev.filter((b) => b.id !== id));
			if (selectedBoard?.id === id) handleBack();
		} catch (err) {
			console.error(`DELETE /boards/${id} failed:`, err);
		}
	};

	const handleViewBoard = async (board) => {
		try {
			const res = await fetch(`${API}/boards/${board.id}/cards`);
			const rows = await res.json();
			const cards = rows.map((c) => ({
				id: c.id,
				title: c.title,
				description: c.description,
				author: c.author,
				gif: c.gif_url,
				votes: c.votes,
			}));
			setSelectedBoard({ ...board, cards });
		} catch (err) {
			console.error(`GET /boards/${board.id}/cards failed:`, err);
		}
	};

	const handleBack = () => {
		setSelectedBoard(null);
		setShowCardModal(false);
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
			setSelectedBoard((prev) => ({
				...prev,
				cards: [newCard, ...prev.cards],
			}));
			setShowCardModal(false);
			setCardFormData({ title: "", description: "", gif: "", author: "" });
		} catch (err) {
			console.error(`POST /boards/${selectedBoard.id}/cards failed:`, err);
		}
	};

	const handleUpvoteCard = async (cardId) => {
		try {
			const res = await fetch(`${API}/cards/${cardId}/vote`, {
				method: "PATCH",
			});
			if (!res.ok) throw new Error("Upvote failed");
			const updated = await res.json();

			setSelectedBoard((b) => ({
				...b,
				cards: b.cards.map((c) => (c.id === updated.id ? { ...c, votes: updated.votes } : c)),
			}));
		} catch (err) {
			console.error("handleUpvoteCard:", err);
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
			console.error(`DELETE /cards/${cardId} failed:`, err);
		}
	};

	// 1) filter by category (including “recent”)
	let filteredByCategory;
	if (filter === "all") {
		filteredByCategory = boards;
	} else if (filter === "recent") {
		filteredByCategory = [...boards]
			.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
			.slice(0, 6);
	} else {
		filteredByCategory = boards.filter((b) => b.category === filter);
	}

	// 2) then filter by the *submitted* searchQuery
	const displayBoards = filteredByCategory.filter(
		(b) =>
			b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			b.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// ——— all your handlers (create/delete/view boards & cards, etc.) go here ———

	// NEW: search form submit
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setSearchQuery(searchTerm.trim());
	};
	// NEW: clear search
	const handleClearSearch = () => {
		setSearchTerm("");
		setSearchQuery("");
	};

	return (
		<div className="app">
			<header className="header">
				<h1>Kudos Board</h1>
				{selectedBoard && (
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

			{!selectedBoard && (
				<section className="controls">
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
					<form className="search-container" onSubmit={handleSearchSubmit}>
						<input
							type="text"
							className="search-input"
							placeholder="Search boards..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button type="submit" className="create-button">
							Search
						</button>
						<button type="button" className="create-button" onClick={handleClearSearch}>
							Clear
						</button>
					</form>
				</section>
			)}

			{selectedBoard ? (
				<Cards
					board={selectedBoard}
					onUpvoteCard={handleUpvoteCard}
					onDeleteCard={handleDeleteCard}
				/>
			) : (
				<BoardList boards={displayBoards} onDelete={handleDeleteBoard} onView={handleViewBoard} />
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
