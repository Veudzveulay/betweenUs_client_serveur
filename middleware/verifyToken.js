const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Accès non autorisé" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;  // Décodage du token et ajout de l'utilisateur à la requête
        next();  // Passe à la prochaine fonction de middleware ou la route
    } catch (err) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }
};

module.exports = verifyToken;