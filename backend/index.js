import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// GET all boards
app.get("/boards", async (req, res) => {
	try {
		const boards = await prisma.board.findMany({
			orderBy: { created_at: "desc" },
		});
		res.json(boards);
	} catch (err) {
		console.error("GET /boards:", err);
		res.status(500).json({ error: "Failed to fetch boards" });
	}
});

// POST create a board
app.post("/boards", async (req, res) => {
	const { title, description, category, image_url, author } = req.body;
	if (!title || !description || !category || !image_url) {
		return res
			.status(400)
			.json({ error: "Missing required fields: title, description, category, image_url" });
	}
	try {
		const board = await prisma.board.create({
			data: {
				title,
				description,
				category,
				image_url,
				author: author || "Anonymous",
			},
		});
		res.status(201).json(board);
	} catch (err) {
		console.error("POST /boards:", err);
		res.status(500).json({ error: "Failed to create board" });
	}
});

// DELETE a board
app.delete("/boards/:boardId", async (req, res) => {
	const boardId = Number(req.params.boardId);
	try {
		const { count } = await prisma.board.deleteMany({
			where: { id: boardId },
		});
		if (count === 0) {
			return res.status(404).json({ error: "Board not found" });
		}
		res.sendStatus(204);
	} catch (err) {
		console.error(`DELETE /boards/${boardId}:`, err);
		res.status(500).json({ error: "Failed to delete board" });
	}
});

// GET all cards for a given board
app.get("/boards/:boardId/cards", async (req, res) => {
	const boardId = Number(req.params.boardId);
	try {
		const rawCards = await prisma.card.findMany({
			where: { board_id: boardId },
			orderBy: { created_at: "desc" },
		});
		const cards = await prisma.card.findMany({
			where: { board_id: boardId },
			orderBy: { created_at: "desc" },
		});
		res.json(cards);
	} catch (err) {
		console.error(`GET /boards/${boardId}/cards:`, err);
		res.status(500).json({ error: "Failed to fetch cards" });
	}
});

// GET one card by board + card ID
app.get("/boards/:boardId/cards/:cardId", async (req, res) => {
	const boardId = Number(req.params.boardId);
	const cardId = Number(req.params.cardId);
	try {
		const card = await prisma.card.findFirst({
			where: { id: cardId, board_id: boardId },
		});
		if (!card) {
			return res.status(404).json({ error: "Card not found on that board" });
		}
		res.json(card);
	} catch (err) {
		console.error(`GET /boards/${boardId}/cards/${cardId}:`, err);
		res.status(500).json({ error: "Failed to fetch card" });
	}
});

// POST create a card under a given board
app.post("/boards/:boardId/cards", async (req, res) => {
	const boardId = Number(req.params.boardId);
	const { title, description, gif_url, author } = req.body;
	if (!title || !description || !gif_url) {
		return res.status(400).json({ error: "Missing required fields: title, description, gif_url" });
	}
	try {
		const card = await prisma.card.create({
			data: {
				board_id: boardId,
				title,
				description,
				gif_url,
				author: author || "Anonymous",
			},
		});
		res.status(201).json(card);
	} catch (err) {
		console.error(`POST /boards/${boardId}/cards:`, err);
		res.status(500).json({ error: "Failed to add card" });
	}
});

// PATCH upvote a card
app.patch("/cards/:cardId/vote", async (req, res) => {
	const cardId = Number(req.params.cardId);
	try {
		const { count } = await prisma.card.updateMany({
			where: { id: cardId },
			data: { votes: { increment: 1 } },
		});
		if (count === 0) {
			return res.status(404).json({ error: "Card not found" });
		}
		// now fetch & return the updated card
		const updated = await prisma.card.findUnique({ where: { id: cardId } });
		res.json(updated);
	} catch (err) {
		console.error(`PATCH /cards/${cardId}/vote`, err);
		res.status(500).json({ error: "Failed to upvote card" });
	}
});

// DELETE a card
app.delete("/cards/:cardId", async (req, res) => {
	const cardId = Number(req.params.cardId);
	try {
		const { count } = await prisma.card.deleteMany({
			where: { id: cardId },
		});
		if (count === 0) {
			return res.status(404).json({ error: "Card not found" });
		}
		res.sendStatus(204);
	} catch (err) {
		console.error(`DELETE /cards/${cardId}:`, err);
		res.status(500).json({ error: "Failed to delete card" });
	}
});

app.get("/cards/:cardId/comments", async (req, res) => {
	const cardId = Number(req.params.cardId);
	const comments = await prisma.comment.findMany({
		where: { card_id: cardId },
		orderBy: { created_at: "asc" },
	});
	res.json(comments);
});

// POST a new comment
app.post("/cards/:cardId/comments", async (req, res) => {
	const cardId = Number(req.params.cardId);
	const { message, author } = req.body;
	if (!message) return res.status(400).json({ error: "Message required" });

	const comment = await prisma.comment.create({
		data: { card_id: cardId, message, author },
	});
	res.status(201).json(comment);
});

// ——— CATCH-ALL 404 ——— //
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// ——— START SERVER ——— //
app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
