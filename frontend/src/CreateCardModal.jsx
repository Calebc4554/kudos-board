import React, { useState } from "react";
import "./CreateCardModal.css";

// Giphy API key inserted directly
export const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_KEY;
export const GIPHY_SEARCH_URL = "https://api.giphy.com/v1/gifs/search";

function CreateCardModal({ formData, setFormData, onClose, onSubmit }) {
	const [gifQuery, setGifQuery] = useState("");
	const [gifResults, setGifResults] = useState([]);

	const searchGifs = async () => {
		if (!gifQuery.trim()) return;
		try {
			const resp = await fetch(
				`${GIPHY_SEARCH_URL}?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
					gifQuery
				)}&limit=12&rating=pg`
			);
			const { data } = await resp.json();
			setGifResults(data);
		} catch (err) {
			console.error("Giphy search failed:", err);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(e);
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<form className="modal-form" onSubmit={handleSubmit}>
					<h2>Create a New Card</h2>

					<input
						type="text"
						placeholder="Title"
						value={formData.title}
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
						required
					/>

					<textarea
						placeholder="Description"
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						required
					/>

					{/* GIF search input */}
					<div className="gif-search">
						<input
							type="text"
							value={gifQuery}
							onChange={(e) => setGifQuery(e.target.value)}
							placeholder="Search GIFs..."
						/>
						<button type="button" onClick={searchGifs} className="search-button">
							Search GIFs
						</button>
					</div>

					{/* GIF picker grid */}
					{gifResults.length > 0 && (
						<div className="gif-picker">
							{gifResults.map((gif) => {
								const url = gif.images.fixed_width_small.url;
								return (
									<img
										key={gif.id}
										src={url}
										alt={gif.title}
										onClick={() => {
											setFormData({ ...formData, gif: url });
											setGifResults([]);
										}}
										className={formData.gif === url ? "selected" : ""}
									/>
								);
							})}
						</div>
					)}

					{/* Preview of selected GIF */}
					{formData.gif && (
						<div className="gif-preview">
							<h4>Chosen GIF:</h4>
							<img src={formData.gif} alt="Selected GIF" />
						</div>
					)}

					<input
						type="text"
						placeholder="Author (optional)"
						value={formData.author}
						onChange={(e) => setFormData({ ...formData, author: e.target.value })}
					/>

					<div className="modal-buttons">
						<button type="submit" className="create-button" disabled={!formData.gif}>
							Add Card
						</button>
						<button type="button" className="cancel-button" onClick={onClose}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateCardModal;
