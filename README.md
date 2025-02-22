Installation de wampserver pour avoir un phpmyadmin pour avoir une base de donnée 

Crée une BDD à l'interieur crée 2 tables (amélioration à faire création des tables automatique)

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(255) NOT NULL UNIQUE, 
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL,  
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,        
    description TEXT NOT NULL,        
    user_id INT NOT NULL,            
    assigned_user_id INT,             
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,  
    FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL
);

Lancer ensuite node server.js pour lancer le serveur back 

Ouvrir un autre terminal de commande pour lancer le front -> cd task-manager et faire npm start
