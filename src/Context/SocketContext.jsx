import React, { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchCounts = async () => {
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
    };

    if (user) fetchCounts();
  }, [user]);

  useEffect(() => {
    let newSocket;

    if (user) {
      const userId = user.id || user._id;

      newSocket = io("http://localhost:6060", {
        query: { userId },
        transports: ["websocket"],
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to Socket Server ✅");
        newSocket.emit("REQUEST_ONLINE_STATUS");
      });

      newSocket.on("GET_ONLINE_USERS", (users) => setOnlineUsers(users));
      newSocket.on("USER_ONLINE", (id) => setOnlineUsers((prev) => [...new Set([...prev, id])]));
      newSocket.on("USER_OFFLINE", (id) => setOnlineUsers((prev) => prev.filter((u) => u !== id)));
      
      newSocket.on("NEW_MESSAGE", (data) => {
        setArrivalMessage(data);

        setMsgUnreadCount((prev) => prev + 1);

        const currentPath = window.location.pathname;
        const isInThisChat = currentPath.includes(data.conversationId);

        if (!isInThisChat) {
          toast.success(`New message from ${data.sender.name}`, {
            icon: '💬',
            duration: 3000,
            position: "bottom-right",
            style: { 
              borderRadius: "15px", 
              background: "#1e1e2e", 
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)" 
            }
          });
        }
      });

      newSocket.on("NEW_NOTIFICATION", (data) => {
        let message = "New activity!";
        if (data.type === "post_like") message = `${data.senderName} liked your post! ❤️`;
        if (data.type === "post_comment") message = `${data.senderName} commented! 💬`;
        if (data.type === "friend_request") message = `${data.senderName} sent a friend request! 👤`;

        toast.success(message, {
          duration: 4000,
          position: "top-right",
          style: { borderRadius: "15px", background: "#1e1e2e", color: "#fff" }
        });

        setUnreadCount((prev) => prev + 1);
        setNotifications((prev) => [data, ...prev]);
      });

      return () => {
        newSocket.off("connect");
        newSocket.off("GET_ONLINE_USERS");
        newSocket.off("USER_ONLINE");
        newSocket.off("USER_OFFLINE");
        newSocket.off("NEW_MESSAGE");
        newSocket.off("NEW_NOTIFICATION");
        newSocket.disconnect();
        setSocket(null);
        console.log("Socket Disconnected ❌");
      };
    }
  }, [user]);

  const clearUnread = () => setUnreadCount(0);
  const clearMsgUnread = () => setMsgUnreadCount(0);
  const updateMsgBadgeAfterSeen = (countToSubtract) => {
  setMsgUnreadCount((prev) => Math.max(0, prev - countToSubtract));
};
  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        setNotifications,
        unreadCount,
        msgUnreadCount,  
        clearUnread,
        clearMsgUnread,
        onlineUsers,
        arrivalMessage,  
        setArrivalMessage,
        updateMsgBadgeAfterSeen
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
