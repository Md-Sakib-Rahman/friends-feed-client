import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, Send, Smile, Paperclip, 
  CheckCheck, Phone, Video, MoreVertical 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useSocket } from "../../../Context/SocketContext";
import axiosInstance from "../../../services/axiosInstance";
import moment from "moment";

const InboxPage = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();  
  const { user } = useSelector((state) => state.auth);
  const { socket, arrivalMessage, setArrivalMessage, onlineUsers, updateMsgBadgeAfterSeen } = useSocket();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [friend, setFriend] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const badgeSubtractedRef = useRef(false);  
  const currentUserId = user?.id || user?._id;

  useEffect(() => {
    const initializeChat = async () => {
      setLoading(true);
      badgeSubtractedRef.current = false;  
      try {
        const res = await axiosInstance.get(`/messages/get-or-create/${chatId}`);
        
        if (res.data.conversation) {
          const conv = res.data.conversation;
          setMessages(res.data.messages || []);
          setConversationId(conv._id);

          const myUnreadCount = conv.unreadCounts?.[currentUserId] || 0;
          
          if (myUnreadCount > 0 && !badgeSubtractedRef.current) {
            updateMsgBadgeAfterSeen(myUnreadCount);
            badgeSubtractedRef.current = true;
            await axiosInstance.put(`/messages/seen/${conv._id}`);
            socket?.emit("MARK_AS_SEEN", { to: res.data.friend._id, conversationId: conv._id });
          }
        } else {
          setMessages([]);
          setConversationId(null);  
        }
        setFriend(res.data.friend);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (chatId) initializeChat();
  }, [chatId, currentUserId]);

  useEffect(() => {
    if (!socket) return;

    if (arrivalMessage && arrivalMessage.conversationId === conversationId) {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === arrivalMessage._id);
        if (exists) return prev;
        return [...prev, arrivalMessage];
      });

      if (arrivalMessage.sender !== currentUserId) {
        axiosInstance.put(`/messages/seen/${conversationId}`);
        socket.emit("MARK_AS_SEEN", { to: friend?._id, conversationId });
        updateMsgBadgeAfterSeen(1); 
      }
      setArrivalMessage(null);
    }

    socket.on("USER_TYPING_START", (data) => {
      if (data.conversationId === conversationId) setIsFriendTyping(true);
    });

    socket.on("USER_TYPING_STOP", (data) => {
      if (data.conversationId === conversationId) setIsFriendTyping(false);
    });

    socket.on("MESSAGES_MARKED_SEEN", (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => prev.map(m => ({ ...m, isSeen: true })));
      }
    });

    return () => {
      socket.off("USER_TYPING_START");
      socket.off("USER_TYPING_STOP");
      socket.off("MESSAGES_MARKED_SEEN");
    };
  }, [arrivalMessage, conversationId, socket, friend, currentUserId, setArrivalMessage, updateMsgBadgeAfterSeen]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !friend || !conversationId) return;

    socket.emit("TYPING_START", { to: friend._id, conversationId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("TYPING_STOP", { to: friend._id, conversationId });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !friend) return;

    const tempText = newMessage;
    const tempId = `temp-${Date.now()}`;
    setNewMessage("");
    socket.emit("TYPING_STOP", { to: friend._id, conversationId });

    try {
      const tempMsg = {
        _id: tempId,
        sender: currentUserId,
        content: tempText,
        createdAt: new Date(),
        isSeen: false
      };
      setMessages((prev) => [...prev, tempMsg]);

      const res = await axiosInstance.post("/messages/send", {
        receiverId: friend._id,
        text: tempText,
      });

      if (res.data._id) {
        setMessages(prev => prev.map(m => m._id === tempId ? res.data : m));
      }
      if (!conversationId && res.data.conversationId) setConversationId(res.data.conversationId);
    } catch (err) {
      console.error("Send error:", err);
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isFriendTyping]);

  const isOnline = friend && onlineUsers.includes(friend._id);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-48px)] max-w-3xl mx-auto bg-base-100/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden relative shadow-2xl">
      
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-base-200/20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/social/messages")} className="btn btn-ghost btn-circle btn-sm lg:hidden">
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <img src={friend?.profilePicture} className="w-10 h-10 rounded-xl object-cover bg-base-300" alt="" />
            {isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100 shadow-sm animate-pulse" />}
          </div>
          <div>
            <h3 className="font-black text-sm">{friend?.name || "Loading..."}</h3>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isOnline ? "text-primary" : "opacity-30"}`}>
              {isOnline ? "Active Now" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-40">
          <button className="btn btn-ghost btn-circle btn-sm"><Phone size={18} /></button>
          <button className="btn btn-ghost btn-circle btn-sm"><Video size={18} /></button>
          <button className="btn btn-ghost btn-circle btn-sm"><MoreVertical size={18} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-pattern">
        {loading ? (
          <div className="flex justify-center items-center h-full opacity-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMe = (msg.sender?._id || msg.sender) === currentUserId;
              return (
                <motion.div key={msg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-2.5 rounded-[1.5rem] text-sm shadow-sm ${isMe ? "bg-primary text-primary-content rounded-tr-none" : "bg-base-200/60 backdrop-blur-md border border-white/5 rounded-tl-none"}`}>
                      <p className="leading-relaxed">{msg.content || msg.text}</p>
                    </div>
                    
                    {/* Status & Time Footer */}
                    <div className="flex items-center gap-1.5 mt-1 px-1">
                      <span className="text-[8px] font-black uppercase opacity-30">
                        {moment(msg.createdAt).format("h:mm A")}
                      </span>
                      
                      {/* logic for double tick and seen text */}
                      {isMe && (
                        <div className="flex items-center">
                          {msg.isSeen ? (
                            <span className="text-[9px] font-black uppercase text-primary tracking-tighter">seen</span>
                          ) : (
                            <CheckCheck size={14} className="opacity-20" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {isFriendTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-2">
                <span className="loading loading-dots loading-xs text-primary opacity-50"></span>
                <span className="text-[10px] font-bold opacity-30 uppercase italic">{friend?.name} is typing...</span>
              </motion.div>
            )}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-6 bg-base-200/30 border-t border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3 bg-base-100/40 border border-white/10 rounded-[2rem] p-2 pr-4 focus-within:border-primary/30 transition-all">
          <button type="button" className="btn btn-ghost btn-circle btn-sm opacity-40"><Paperclip size={18} /></button>
          <input
            type="text"
            placeholder="Write a message..."
            className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm"
            value={newMessage}
            onChange={handleInputChange}
          />
          <button type="submit" disabled={!newMessage.trim()} className="btn btn-primary btn-circle btn-sm shadow-lg shadow-primary/20 flex items-center justify-center disabled:opacity-20">
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InboxPage;
