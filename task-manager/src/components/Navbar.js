import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h1>Task Manager</h1>
            <ul className="nav-links">
                {!token ? (
                    <>
                        <li><Link to="/login">Connexion</Link></li>
                        <li><Link to="/register">Inscription</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/">Liste des tâches</Link></li>
                        <li><Link to="/tasks/new">Ajouter une tâche</Link></li>
                        <li><button onClick={handleLogout} className="logout-btn">Déconnexion</button></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
