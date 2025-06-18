// src/Modal.jsx
import React from "react";
import "./Modal.css";

function Modal({ formData, setFormData, onClose, onSubmit }) {
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<form className="modal-form" onSubmit={onSubmit}>
					<h2>Create a New Board</h2>
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
					<select
						value={formData.category}
						onChange={(e) => setFormData({ ...formData, category: e.target.value })}
						required
					>
						<option value="celebration">Celebration</option>
						<option value="thank you">Thank You</option>
						<option value="inspiration">Inspiration</option>
						<option value="recent">Recent</option>
					</select>
					<input
						type="text"
						placeholder="Image URL"
						value={formData.image}
						onChange={(e) => setFormData({ ...formData, image: e.target.value })}
						required
					/>
					<input
						type="text"
						placeholder="Author (optional)"
						value={formData.author}
						onChange={(e) => setFormData({ ...formData, author: e.target.value })}
					/>
					<div className="modal-buttons">
						<button type="submit" className="create-button">
							Create
						</button>
						<button type="button" className="delete-button" onClick={onClose}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Modal;
  