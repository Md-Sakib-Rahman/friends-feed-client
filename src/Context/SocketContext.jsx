import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../services/axiosInstance";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);  
  const [msgUnreadCount, setMsgUnreadCount] = useState(0);  
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);  

  const { user } = useSelector((state) => state.auth);

  const fetchCounts = useCallback(async () => {
    try {
      const [notifRes, msgRes] = await Promise.all([
        axiosInstance.get("/notifications/unread-count"),
        axiosInstance.get("/messages/unread-count")  
      ]);
      setUnreadCount(notifRes.data.count);
      setMsgUnreadCount(msgRes.data.count);
    } catch (err) {
      console.error("Error fetching unread counts:", err);
    }
  }, []);

  useEffect(() => {
    if (user) fetchCounts();
  }, [user, fetchCounts]);

  useEffect(() => {
    if (!user) return;

    const userId = user.id || user._id;
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
      reconnectionAttempts: 5,  
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Socket Server ✅");
      newSocket.emit("REQUEST_ONLINE_STATUS");
    });

    newSocket.on("GET_ONLINE_USERS", (users) => {
      setOnlineUsers(users); 
    });

    newSocket.on("USER_ONLINE", (id) => {
      setOnlineUsers((prev) => (prev.includes(id) ? prev : [...prev, id]));
    });

    newSocket.on("USER_OFFLINE", (id) => {
      setOnlineUsers((prev) => prev.filter((u) => u !== id));
    });

    // --- Message & Notification Logic ---
    newSocket.on("NEW_MESSAGE", (data) => {
      setArrivalMessage(data);
      setMsgUnreadCount((prev) => prev + 1);
      
      const isInThisChat = window.location.pathname.includes(data.conversationId);
      if (!isInThisChat) {
        toast.success(`New message from ${data.sender.name}`, { icon: '💬' });
      }
    });

    newSocket.on("NEW_NOTIFICATION", (data) => {
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [data, ...prev]);
      
      let msg = data.type === "post_like" ? `${data.senderName} liked your post! ❤️` : "New activity!";
      toast.success(msg);
    });

    newSocket.on("disconnect", () => {
      setOnlineUsers([]);
      console.log("Socket Disconnected ❌");
    });

    return () => {
      newSocket.close();  
    };
  }, [user]);

  const updateMsgBadgeAfterSeen = (countToSubtract) => {
    setMsgUnreadCount((prev) => Math.max(0, prev - countToSubtract));
  };

  return (
    <SocketContext.Provider
      value={{
        socket, notifications, setNotifications,
        unreadCount, msgUnreadCount,
        clearUnread: () => setUnreadCount(0),
        clearMsgUnread: () => setMsgUnreadCount(0),
        onlineUsers, arrivalMessage, setArrivalMessage,
        updateMsgBadgeAfterSeen
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
