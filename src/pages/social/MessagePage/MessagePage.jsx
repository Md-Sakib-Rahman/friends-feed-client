import React, { useState, useEffect } from "react";
import { 
  Search, MessageSquare, Edit, ChevronRight, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useSocket } from "../../../Context/SocketContext";
import axiosInstance from "../../../services/axiosInstance";
import moment from "moment";

const MessagePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers, arrivalMessage } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserId = user?.id || user?._id;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axiosInstance.get("/messages/conversations");
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUserId) fetchConversations();
  }, [currentUserId]);

  useEffect(() => {
    if (arrivalMessage) {
      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if (conv._id === arrivalMessage.conversationId) {
            return {
              ...conv,
              lastMessage: {
                ...arrivalMessage,
                content: arrivalMessage.content  
              },
              updatedAt: new Date()
            };
          }
          return conv;
        });
        return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    }
  }, [arrivalMessage]);

  const filteredConversations = conversations.filter((conv) => {
    const otherMember = conv.participants.find(p => p._id !== currentUserId);
    return otherMember?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherMember?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-2xl mx-auto pb-20 px-4">
      {/* Header & Search */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-[1.5rem] text-primary shadow-inner">
              <MessageSquare size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Messages</h1>
              <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">
                {conversations.length} active conversations
              </p>
            </div>
          </div>
          <button className="btn btn-circle btn-primary shadow-lg shadow-primary/20">
            <Edit size={20} />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 group-focus-within:text-primary transition-all" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-base-200/40 backdrop-blur-xl border border-white/5 focus:border-primary/30 outline-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-20 opacity-20">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : filteredConversations.length > 0 ? (
          <AnimatePresence>
            {filteredConversations.map((chat, index) => {
              const otherMember = chat.participants.find(p => p._id !== currentUserId);
              const isOnline = onlineUsers.includes(otherMember?._id);
              
              const unreadCount = chat.unreadCounts?.[currentUserId] || 0;

              return (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/social/messages/${chat._id}`)}
                  className="group relative bg-base-200/40 backdrop-blur-xl border border-white/5 p-4 rounded-[2.2rem] flex items-center justify-between hover:bg-base-200 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={otherMember?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${otherMember?.name}`}
                        className="w-14 h-14 rounded-2xl object-cover shadow-lg bg-base-300"
                        alt=""
                      />
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-base-100 shadow-sm">
                          <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-black text-base truncate group-hover:text-primary transition-colors">
                          {otherMember?.name}
                        </h3>
                        <span className="text-[10px] font-bold opacity-30 uppercase">
                          {moment(chat.updatedAt).fromNow(true)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate ${unreadCount > 0 ? "font-bold text-base-content" : "opacity-40"}`}>
                          {chat.lastMessage?.content || "No messages yet"}
                        </p>
                        {unreadCount > 0 && (
                          <span className="ml-2 bg-primary text-primary-content text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-primary/20">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={18} className="text-primary" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="text-center py-20 opacity-20">
            <Zap size={40} className="mx-auto mb-4" />
            <p className="font-black uppercase tracking-widest text-xs">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
