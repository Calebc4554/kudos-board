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
	const handleTogglePin = async (cardId) => {
		const res = await fetch(`${API}/cards/${cardId}/pin`, { method: "PATCH" });
		const updated = await res.json();
		// update selectedBoard.cards:
		setSelectedBoard((b) => ({
			...b,
			cards: b.cards
				.map((c) => (c.id === updated.id ? updated : c))
				.sort((a, b) => {
					// pinned first
					if (!!a.pinned_at !== !!b.pinned_at) return b.pinned_at ? 1 : -1;
					// among pinned, sort by pinned_at asc so oldest pin at top
					if (a.pinned_at && b.pinned_at) return new Date(a.pinned_at) - new Date(b.pinned_at);
					// else fallback to created_at desc
					return new Date(b.created_at) - new Date(a.created_at);
				}),
		}));
	};

	const handleViewBoard = async (board) => {
		try {
			const res = await fetch(`${API}/boards/${board.id}/cards`);
			const rows = await res.json();
			const cards = rows
				.map((c) => ({
					id: c.id,
					title: c.title,
					description: c.description,
					author: c.author,
					gif: c.gif_url,
					votes: c.votes,
					pinned_at: c.pinned_at,
					created_at: c.created_at,
				}))
				.sort((a, b) => {
					if (!!a.pinned_at !== !!b.pinned_at) {
						return b.pinned_at ? 1 : -1;
					}
					if (a.pinned_at && b.pinned_at) {
						return new Date(b.pinned_at) - new Date(a.pinned_at);
					}
					return new Date(b.created_at) - new Date(a.created_at);
				});

			setSelectedBoard({ ...board, cards });
		} catch (err) {
			console.error(err);
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
				cards: [
					{ ...newCard, pinned_at: null }, // unpinned by default
					...prev.cards,
				],
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
			<div className="top-container">
				<header className="header">
					<h1>MagmaBoard 🔥</h1>

					{selectedBoard && (
						<div className="header-actions">
							<button type="button" className="back-button" onClick={handleBack}>
								← Back to Boards
							</button>
							<button
								type="button"
								className="create-card-button"
								onClick={() => setShowCardModal(true)}
							>
								+ Add Card
							</button>
						</div>
					)}
				</header>

				{!selectedBoard && (
					<div className="controls">
						<section className="banner">
							<h2>Where recognition erupts</h2>
							<p>Channel every win through molten applause</p>
							<button type="button" className="create-button" onClick={() => setShowForm(true)}>
								+ Create New Board
							</button>
						</section>

						<nav className="filter-container" aria-label="Board categories">
							{categories.map((cat) => (
								<button
									key={cat}
									type="button"
									className={`filter-button ${filter === cat ? "active" : ""}`}
									onClick={() => setFilter(cat)}
								>
									{cat.charAt(0).toUpperCase() + cat.slice(1)}
								</button>
							))}
						</nav>

						<form className="search-container" onSubmit={handleSearchSubmit} role="search">
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
					</div>
				)}
			</div>

			<main className="content-area">
				{selectedBoard ? (
					<Cards
						board={selectedBoard}
						onUpvoteCard={handleUpvoteCard}
						onDeleteCard={handleDeleteCard}
						onTogglePin={handleTogglePin}
					/>
				) : (
					<BoardList boards={displayBoards} onDelete={handleDeleteBoard} onView={handleViewBoard} />
				)}
			</main>

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
