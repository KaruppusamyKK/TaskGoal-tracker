import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Home from "./pages/Home.js";
import MyTask from "./pages/MyTask.js";
import ChatWindow from "./pages/ChatWindow.js";
import Notification from '../src/pages/Notification.js';
import "./index.css";
import { OpenTaskProvider } from "./context/OpenTaskContext.js";
function App() {
  return (
    <OpenTaskProvider>
    <Router>
      <div style={{ overflow: "hidden", padding: "16px" }}>
        <Routes>
          <Route path="/my-tasks" element={<MyTask />} />
          <Route path="/chatWindow" element={<ChatWindow />} />
          <Route path="/notify" element={<Notification />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
    </OpenTaskProvider>
  );
}

export default App;
