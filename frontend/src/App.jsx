import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider, useSocket } from "./context/SocketContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./index.css";

function Inner() {
  const { authUser, isCheckingAuth } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { subscribeToMessages, unsubscribeFromMessages } = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!authUser) return;

    // Listen for messages from ALL users
    const handleNewMessage = (msg) => {
      // Only notify if not currently chatting with this sender
      if (!selectedUser || String(selectedUser._id) !== String(msg.senderId)) {
        setNotifications((prev) => [...prev, msg]);
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n._id !== msg._id));
        }, 4000);
      }
    };

    subscribeToMessages("__global__", handleNewMessage);
    return () => unsubscribeFromMessages("__global__");
  }, [authUser, selectedUser]);

  if (isCheckingAuth) {
    return (
      <div className="splash">
        <span className="logo-icon splash-icon">✦</span>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="auth-page">
        {showSignup ? (
          <SignupPage onSwitch={() => setShowSignup(false)} />
        ) : (
          <LoginPage onSwitch={() => setShowSignup(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <main className="chat-area">
        <ChatWindow receiver={selectedUser} />
      </main>

      {/* Notification popups */}
      <div className="notif-stack">
        {notifications.map((n) => (
          <div key={n._id} className="notif-toast">
            <div className="notif-avatar">{n.senderId?.toString().slice(-2).toUpperCase()}</div>
            <div className="notif-body">
              <span className="notif-name">New message</span>
              <span className="notif-text">{n.message}</span>
            </div>
            <button
              className="notif-close"
              onClick={() =>
                setNotifications((prev) => prev.filter((x) => x._id !== n._id))
              }
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Inner />
      </SocketProvider>
    </AuthProvider>
  );
}