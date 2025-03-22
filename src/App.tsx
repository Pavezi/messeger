import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Messages from "./pages/Messages";
import Contacts from "./pages/Contacts";
import Connections from "./pages/Connections";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import SendMessage from "./pages/SendMessage";
import { ConnectionsProvider } from "./context/ConnectionsContext";

const App: React.FC = () => {
  return (
    <ConnectionsProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/send-message"
            element={
              <ProtectedRoute>
                <SendMessage />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/connections/:connectionId/contacts"
            element={
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ConnectionsProvider>
  );
};

export default App;
