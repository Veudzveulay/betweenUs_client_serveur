import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/TaskForm.css";

const TaskForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(""); 
    const [users, setUsers] = useState([]); 
    const [userId, setUserId] = useState(""); 
    const navigate = useNavigate();

    // Récupérer la liste des utilisateurs
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setUsers(response.data);
                console.log("Utilisateurs récupérés :", response.data);  
            } catch (error) {
                setError("Erreur lors de la récupération des utilisateurs.");
            }
        };
    
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !userId) {
            setError("Le titre, la description et l'utilisateur assigné sont requis.");
            return;
        }

        // Récupérer le token dans le localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Token non trouvé. Veuillez vous connecter.");
            return;
        }

        try {
            await axios.post(
                "http://localhost:5000/api/tasks",
                {
                    title,
                    description,
                    assigned_user_id: userId, 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Afficher un message de succès
            setSuccessMessage("Tâche ajoutée avec succès !");
            setError(null);
            setTitle("");
            setDescription("");
            setUserId("");

            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                setError("Token invalide ou expiré. Veuillez vous reconnecter.");
            } else {
                setError("Erreur lors de l'ajout de la tâche. Veuillez réessayer.");
            }
        }
    };

    return (
        <div className="task-form">
            <h2>Ajouter une tâche</h2>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Titre :</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titre de la tâche"
                    />
                </div>
                <div>
                    <label>Description :</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description de la tâche"
                    />
                </div>
                <div>
                    <label>Assigner à :</label>
                    <select
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    >
                        <option value="">Sélectionner un utilisateur</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Ajouter la tâche</button>
            </form>
        </div>
    );
};

export default TaskForm;
