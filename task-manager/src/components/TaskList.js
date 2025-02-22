import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/TaskList.css";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchCurrentUser = () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
                    setCurrentUserId(decodedToken.id);
                } catch (err) {
                    console.error("Erreur lors du décodage du token", err);
                    setError("Erreur lors de l'identification de l'utilisateur.");
                }
            }
        };

        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/tasks", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors de la récupération des tâches :", err);
                setError("Erreur lors de la récupération des tâches.");
                setLoading(false);
            }
        };

        fetchCurrentUser(); 
        fetchTasks();
    }, []);

    const handleDelete = async (taskId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(tasks.filter((task) => task.id !== taskId)); 
            setDeleteSuccess("Tâche supprimée avec succès !");
            setTimeout(() => setDeleteSuccess(null), 3000);
        } catch (err) {
            console.error("Erreur lors de la suppression de la tâche :", err);
            setError("Erreur lors de la suppression de la tâche.");
        }
    };

    const handleEdit = (task) => {
        navigate(`/tasks/edit/${task.id}`);
    };

    if (loading) return <p>Chargement des tâches...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="task-list-container">
            <h2>Liste des Tâches</h2>
            {deleteSuccess && <p className="success-message">{deleteSuccess}</p>}
            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id} className="task-item">
                        <div className="task-details">
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            
                            {task.user_id === currentUserId && (
                                task.assigned_user_id === null ? (
                                    <p><strong>Assigné à :</strong> Non assigné</p>
                                ) : (
                                    <p>
                                        <strong>Assigné à :</strong> {task.assigned_username || "Utilisateur inconnu"}
                                    </p>
                                )
                            )}
                        </div>

                        <div className="task-actions">
                            {currentUserId && currentUserId === task.user_id && (
                                <>
                                    <button onClick={() => handleEdit(task)} className="edit-btn">Modifier</button>
                                    <button onClick={() => handleDelete(task.id)} className="delete-btn">Supprimer</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default TaskList;