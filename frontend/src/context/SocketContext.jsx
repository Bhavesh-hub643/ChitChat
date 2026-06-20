import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(undefined);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

export const SocketProvider = ({ children }) => {
  const { authUser } = useAuth();
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messageListeners = useRef(new Map());

  useEffect(() => {
    if (!authUser) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setOnlineUsers([]);
      return;
    }

    const socket = io(SOCKET_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("getOnlineUsers", (users) => setOnlineUsers(users));

    socket.on("newMessage", (message) => {
      // Notify active chat listener
      const cb = messageListeners.current.get(String(message.senderId));
      if (cb) cb(message);

      // Also notify global listener (always call it, let the subscriber decide to filter)
      const globalCb = messageListeners.current.get("__global__");
      if (globalCb) globalCb(message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authUser]);

  // Wrap in useCallback-like stable refs so consumers don't re-render on every call
  const subscribeToMessages = useRef((senderId, callback) => {
    messageListeners.current.set(String(senderId), callback);
  }).current;

  const unsubscribeFromMessages = useRef((senderId) => {
    messageListeners.current.delete(String(senderId));
  }).current;

  const isOnline = (userId) => onlineUsers.includes(String(userId));

  return (
    <SocketContext.Provider
      value={{
        onlineUsers,
        isOnline,
        subscribeToMessages,
        unsubscribeFromMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (ctx === undefined) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
};