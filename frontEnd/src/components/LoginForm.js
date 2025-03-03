import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginForm.css";


const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();  

        try {
            const response = await axios.post("http://localhost:5000/api/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            navigate("/");
        } catch (err) {
            console.error("Erreur lors de la connexion :", err);
            setError("Erreur de connexion. Veuillez vérifier vos informations.");
        }
    };

    return (
        <div className="login-form">
            <h2>Se connecter</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre email"
                        required
                    />
                </div>
                <div>
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        required
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default LoginForm;
