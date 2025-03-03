import React, { useState, useEffect } from "react";
import { useSocket } from "./SocketProvider";
import "../styles/Chat.css";  // Importation du fichier CSS

const Chat = () => {
    const socket = useSocket();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isNameSet, setIsNameSet] = useState(false);

    useEffect(() => {
        if (!socket) return;

        socket.on("receiveMessage", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("typing", (username) => {
            setIsTyping(username ? `${username} est en train de taper...` : "");
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("typing");
        };
    }, [socket]);

    const sendMessage = () => {
        if (message.trim() && socket) {
            socket.emit("sendMessage", { userName, message });
            setMessage("");
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);
        if (e.target.value.trim()) {
            socket.emit("typing", userName);
        } else {
            socket.emit("typing", "");
        }
    };

    const handleNameChange = (e) => {
        setUserName(e.target.value);
    };

    const handleStartChat = () => {
        if (userName.trim()) {
            setIsNameSet(true);
        }
    };

    return (
        <div className="chat-container">
            <h2 className="chat-title">Chat en temps réel</h2>
            {!isNameSet ? (
                <div className="name-input-container">
                    <input
                        type="text"
                        className="input-name"
                        placeholder="Entrez votre nom"
                        value={userName}
                        onChange={handleNameChange}
                    />
                    <button 
                        onClick={handleStartChat} 
                        className="start-chat-button" 
                        disabled={!userName.trim()} 
                    >
                        Commencer
                    </button>
                </div>
            ) : (
                <>
                    <div className="messages-container">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.userName === userName ? "sent" : "received"}`}
                            >
                                <strong>{msg.userName}: </strong>{msg.message}
                            </div>
                        ))}
                    </div>

                    {isTyping && <div className="typing-indicator">{isTyping}</div>}

                    <div className="input-container">
                        <input
                            type="text"
                            className="input-message"
                            value={message}
                            onChange={handleTyping}
                            placeholder="Écris un message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="send-button"
                        >
                            Envoyer
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chat;