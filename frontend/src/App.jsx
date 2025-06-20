import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";
import BoardList from "./BoardList";
import Cards from "./Cards";
import CreateBoardModal from "./CreateBoardModal";
import CreateCardModal from "./CreateCardModal";

const API = import.meta.env.VITE_API_BASE_URL;

function BoardCardsPage({
	boards,
	onUpvoteCard,
	onDeleteCard,
	onTogglePin,
	onAddCard,
	showCardModal,
	setShowCardModal,
	cardFormData,
	setCardFormData,
}) {
	const { boardId } = useParams();
	const [board, setBoard] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCards = async () => {
			const boardObj = boards.find((b) => String(b.id) === boardId);
			if (!boardObj) return;
			const res = await fetch(`${API}/boards/${boardId}/cards`);
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
					if (!!a.pinned_at !== !!b.pinned_at) return b.pinned_at ? 1 : -1;
					if (a.pinned_at && b.pinned_at) return new Date(a.pinned_at) - new Date(b.pinned_at);
					return new Date(b.created_at) - new Date(a.created_at);
				});
			setBoard({ ...boardObj, cards });
		};
		fetchCards();
	}, [boardId, boards, showCardModal]);

	if (!board) return <div>Loading...</div>;

	return (
		<>
			<div className="header-actions">
				<button type="button" className="back-button" onClick={() => navigate("/")}>
					← Back to Boards
				</button>
				<button type="button" className="create-card-button" onClick={() => setShowCardModal(true)}>
					+ Add Card
				</button>
			</div>
			<Cards
				board={board}
				onUpvoteCard={onUpvoteCard}
				onDeleteCard={onDeleteCard}
				onTogglePin={onTogglePin}
			/>
			{showCardModal && (
				<CreateCardModal
					formData={cardFormData}
					setFormData={setCardFormData}
					onClose={() => setShowCardModal(false)}
					onSubmit={(e) => onAddCard(e, board.id)}
				/>
			)}
		</>
	);
}

export default function App() {
	const [boards, setBoards] = useState([]);
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
	const navigate = useNavigate();

	// Theme handling
	const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
	useEffect(() => {
		document.body.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);
	const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

	// Load boards
	useEffect(() => {
		fetch(`${API}/boards`)
			.then((res) => res.json())
			.then(setBoards)
			.catch((err) => console.error("GET /boards failed:", err));
	}, []);

	// Board CRUD
	const handleCreateBoard = async (e) => {
		e.preventDefault();
		const payload = { ...formData, image_url: formData.image };
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
		} catch (err) {
			console.error(`DELETE /boards/${id} failed:`, err);
		}
	};

	// Card handlers
	const handleAddCard = async (e, boardId) => {
		e.preventDefault();
		const payload = { ...cardFormData };
		delete payload.gif;
		payload.gif_url = cardFormData.gif;
		try {
			const res = await fetch(`${API}/boards/${boardId}/cards`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const newCard = await res.json();
			setBoards((prev) =>
				prev.map((b) =>
					b.id === boardId
						? { ...b, cards: b.cards ? [{ ...newCard, pinned_at: null }, ...b.cards] : [newCard] }
						: b
				)
			);
			setShowCardModal(false);
			setCardFormData({ title: "", description: "", gif: "", author: "" });
		} catch (err) {
			console.error(`POST /boards/${boardId}/cards failed:`, err);
		}
	};

	const handleUpvoteCard = async (cardId) => {
		try {
			const res = await fetch(`${API}/cards/${cardId}/vote`, { method: "PATCH" });
			if (!res.ok) throw new Error("Upvote failed");
			const updated = await res.json();
			setBoards((prev) =>
				prev.map((b) => ({
					...b,
					cards: b.cards
						? b.cards.map((c) => (c.id === updated.id ? { ...c, votes: updated.votes } : c))
						: b.cards,
				}))
			);
		} catch (err) {
			console.error("handleUpvoteCard:", err);
		}
	};

	const handleDeleteCard = async (cardId) => {
		try {
			await fetch(`${API}/cards/${cardId}`, { method: "DELETE" });
			setBoards((prev) =>
				prev.map((b) => ({
					...b,
					cards: b.cards ? b.cards.filter((c) => c.id !== cardId) : b.cards,
				}))
			);
		} catch (err) {
			console.error(`DELETE /cards/${cardId} failed:`, err);
		}
	};

	const handleTogglePin = async (cardId) => {
		const res = await fetch(`${API}/cards/${cardId}/pin`, { method: "PATCH" });
		const updated = await res.json();
		setBoards((prev) =>
			prev.map((b) => ({
				...b,
				cards: b.cards
					? b.cards
							.map((c) => (c.id === updated.id ? updated : c))
							.sort((a, b) => {
								if (!!a.pinned_at !== !!b.pinned_at) return b.pinned_at ? 1 : -1;
								if (a.pinned_at && b.pinned_at)
									return new Date(a.pinned_at) - new Date(b.pinned_at);
								return new Date(b.created_at) - new Date(a.created_at);
							})
					: b.cards,
			}))
		);
	};

	// Filtering
	let filteredByCategory;
	if (filter === "all") filteredByCategory = boards;
	else if (filter === "recent")
		filteredByCategory = [...boards]
			.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
			.slice(0, 6);
	else filteredByCategory = boards.filter((b) => b.category.toLowerCase() === filter.toLowerCase());

	const displayBoards = filteredByCategory.filter(
		(b) =>
			b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			b.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setSearchQuery(searchTerm.trim());
	};
	const handleClearSearch = () => {
		setSearchTerm("");
		setSearchQuery("");
	};

	const handleViewBoard = (board) => navigate(`/boards/${board.id}`);

	return (
		<div className="app">
			<button
				className="theme-toggle"
				onClick={toggleTheme}
				aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
			>
				{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
			</button>

			<main className="content-area">
				<Routes>
					<Route
						path="/"
						element={
							<>
								<div className="top-container">
									<header className="header">
										<h1>MagmaBoard 🔥</h1>
									</header>
									<div className="controls">
										<section className="banner">
											<h2>Where recognition erupts</h2>
											<p>Channel every win through molten applause</p>
											<button
												type="button"
												className="create-button"
												onClick={() => setShowForm(true)}
											>
												+ Create New Board
											</button>
										</section>
										<nav className="filter-container" aria-label="Board categories">
											{categories.map((cat) => (
												<button
													key={cat}
													type="button"
													className={`filter-button ${filter === cat ? "active" : ""}`}
													onClick={() => {
														setFilter(cat);
														setSearchTerm("");
														setSearchQuery("");
													}}
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
								</div>

								<BoardList
									boards={displayBoards}
									onDelete={handleDeleteBoard}
									onView={handleViewBoard}
								/>

								{showForm && (
									<CreateBoardModal
										formData={formData}
										setFormData={setFormData}
										onClose={() => setShowForm(false)}
										onSubmit={handleCreateBoard}
									/>
								)}
							</>
						}
					/>

					<Route
						path="/boards/:boardId"
						element={
							<BoardCardsPage
								boards={boards}
								onUpvoteCard={handleUpvoteCard}
								onDeleteCard={handleDeleteCard}
								onTogglePin={handleTogglePin}
								onAddCard={handleAddCard}
								showCardModal={showCardModal}
								setShowCardModal={setShowCardModal}
								cardFormData={cardFormData}
								setCardFormData={setCardFormData}
							/>
						}
					/>
				</Routes>
			</main>

			<footer className="footer">
				<p>© 2025 Kudos Board. All rights reserved.</p>
			</footer>
		</div>
	);
}
