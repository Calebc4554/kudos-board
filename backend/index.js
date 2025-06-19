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

// POST (create) a board
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


app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
