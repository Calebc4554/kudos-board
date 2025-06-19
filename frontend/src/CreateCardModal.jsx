import React from "react";
import "./CreateCardModal.css";

function CreateCardModal({ formData, setFormData, onClose, onSubmit }) {
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<form className="modal-form" onSubmit={onSubmit}>
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

					<input
						type="text"
						placeholder="GIF URL"
						value={formData.gif}
						onChange={(e) => setFormData({ ...formData, gif: e.target.value })}
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
