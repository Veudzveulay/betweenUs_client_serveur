import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({ title: "", description: "", assigned_user_id: null });
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTask(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération de la tâche:", err);
                setError("Erreur lors de la récupération de la tâche.");
            }
        };
    
        fetchTask();
    }, [id]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!task.title || !task.description) {
            setError("Le titre et la description sont requis.");
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/tasks/${id}`, task, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate("/tasks");
        } catch (err) {
            console.error("Erreur lors de la mise à jour de la tâche:", err);
            setError("Erreur lors de la mise à jour de la tâche.");
        }
    };
    

    return (
        <div className="edit-task-form">
            <h2>Modifier la tâche</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Titre:</label>
                    <input
                        type="text"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Utilisateur assigné:</label>
                    <input
                        type="number"
                        value={task.assigned_user_id || ""}
                        onChange={(e) => setTask({ ...task, assigned_user_id: e.target.value })}
                    />
                </div>
                <button type="submit">Enregistrer les modifications</button>
            </form>
        </div>
    );
};

export default EditTask;
