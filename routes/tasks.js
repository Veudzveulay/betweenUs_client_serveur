const express = require("express");
const db = require("../db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Route pour obtenir toutes les tâches (accessible uniquement aux utilisateurs authentifiés)
router.get("/tasks", verifyToken, (req, res) => {
    const userId = req.user.id;  // L'utilisateur connecté à partir du token

    // Récupérer les tâches créées par l'utilisateur ou assignées à cet utilisateur
    db.query(`
        SELECT tasks.*, users.username AS assigned_username
        FROM tasks
        LEFT JOIN users ON tasks.assigned_user_id = users.id
        WHERE tasks.user_id = ? OR tasks.assigned_user_id = ?`,
        [userId, userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);  // Envoi des tâches créées ou assignées à l'utilisateur
        });
});

// Route pour obtenir une tâche par ID (accessible uniquement aux utilisateurs authentifiés)
router.get("/tasks/:id", verifyToken, (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;  // L'utilisateur connecté à partir du token

    db.query("SELECT * FROM tasks WHERE id = ? AND (user_id = ? OR assigned_user_id = ?)", 
        [taskId, userId, userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ error: "Tâche non trouvée" });

            res.json(results[0]);  // Envoi de la tâche
        });
});

// Route pour ajouter une nouvelle tâche (accessible uniquement aux utilisateurs authentifiés)
router.post("/tasks", verifyToken, (req, res) => {
    const { title, description, assigned_user_id } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
        return res.status(400).json({ error: "Le titre et la description sont requis" });
    }

    // Ajouter la tâche avec l'ID de l'utilisateur créateur et l'ID de l'utilisateur assigné
    db.query("INSERT INTO tasks (title, description, user_id, assigned_user_id) VALUES (?, ?, ?, ?)", [title, description, userId, assigned_user_id], (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: results.insertId, title, description, user_id: userId, assigned_user_id });
    });
});



// Route pour modifier une tâche existante (accessible uniquement aux utilisateurs authentifiés)
router.put("/tasks/:id", verifyToken, (req, res) => {
    const { title, description, assigned_user_id } = req.body;
    const taskId = req.params.id;
    const userId = req.user.id;

    if (!title || !description) {
        return res.status(400).json({ error: "Le titre et la description sont requis" });
    }

    db.query("SELECT * FROM tasks WHERE id = ?", [taskId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Tâche non trouvée" });

        const task = results[0];
        if (task.user_id !== userId) {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à modifier cette tâche." });
        }

        // Si assigned_user_id est fourni, le mettre à jour, sinon laisser la valeur existante
        const newAssignedUserId = assigned_user_id || task.assigned_user_id;

        db.query("UPDATE tasks SET title = ?, description = ?, assigned_user_id = ? WHERE id = ?", 
            [title, description, newAssignedUserId, taskId], 
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Tâche mise à jour" });
            }
        );
    });
});


// Route pour supprimer une tâche (accessible uniquement aux utilisateurs authentifiés)
router.delete("/tasks/:id", verifyToken, (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    db.query("SELECT * FROM tasks WHERE id = ?", [taskId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Tâche non trouvée" });

        const task = results[0];
        if (task.user_id !== userId) {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à supprimer cette tâche." });
        }

        // Supprimer la tâche si l'utilisateur est le créateur
        db.query("DELETE FROM tasks WHERE id = ?", [taskId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Tâche supprimée" });
        });
    });
});

// Exemple de route pour récupérer les utilisateurs
router.get("/users", verifyToken, (req, res) => {
    db.query("SELECT id, username FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});



module.exports = router;