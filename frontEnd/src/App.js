import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import EditTask from "./components/EditTask";
import Chat from "./components/Chat";
import { SocketProvider } from "./components/SocketProvider";

const App = () => {
    return (
        <SocketProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<TaskList />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/tasks/new" element={<TaskForm />} />
                    <Route path="/tasks/edit/:id" element={<EditTask />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </Router>
        </SocketProvider>
    );
};

export default App;