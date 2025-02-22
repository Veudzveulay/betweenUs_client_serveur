const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// Inscription
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ error: "Email déjà utilisé" });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });

                // Création d'un token après inscription
                const token = jwt.sign(
                    { id: results.insertId, username },
                    SECRET,
                    { expiresIn: "1h" }
                );

                res.json({ message: "Utilisateur créé avec succès", token });
            }
        );
    });
});

// Connexion
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "Utilisateur non trouvé" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Mot de passe incorrect" });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
        res.json({ token });
    });
});

module.exports = router;