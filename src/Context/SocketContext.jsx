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
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axiosInstance.get("/notifications/unread-count");
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    if (user) {
      fetchUnreadCount();
    }
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
        console.log("Connected to Socket Server  ");
      });

      newSocket.on("NEW_NOTIFICATION", (data) => {
        let message = "New activity in your circle!";
        if (data.type === "post_like")
          message = `${data.senderName} liked your post!  `;
        if (data.type === "post_comment")
          message = `${data.senderName} commented on your post!  `;
        if (data.type === "friend_request")
          message = `${data.senderName} sent you a friend request!  `;

        toast.success(message, {
          duration: 4500,
          position: "top-right",
          style: { 
            borderRadius: "15px", 
            background: "#1e1e2e", 
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)" 
          },
        });

        setUnreadCount((prev) => prev + 1);
        setNotifications((prev) => [data, ...prev]);
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
        console.log("Socket Disconnected  ");
      };
    }
  }, [user]);

  const clearUnread = () => setUnreadCount(0);

  return (
    <SocketContext.Provider
      value={{ 
        socket, 
        notifications, 
        setNotifications,  
        unreadCount, 
        clearUnread 
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
