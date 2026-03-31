import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Zap,
  Heart,
  MessageSquare,
  UserPlus,
  Clock,
  Eye,
} from "lucide-react";
import axiosInstance from "../../../services/axiosInstance";
import { useSocket } from "../../../Context/SocketContext";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";

const NotificationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { clearUnread, notifications, setNotifications } = useSocket();
  const [dbNotifications, setDbNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    clearUnread();
    markAllAsRead();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      setDbNotifications(res.data);
      setNotifications([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const allNotifications = [...notifications, ...dbNotifications];

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/notifications/mark-read");
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await axiosInstance.put(`/users/request/respond/${requestId}`, {
        status,
      });
      const successMessage =
        status === "accepted" ? "Connection established" : "Request declined";
      toast.success(successMessage);

      setNotifications((prev) => prev.filter((n) => n._id !== requestId));
      setDbNotifications((prev) => prev.filter((n) => n._id !== requestId));
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "post_like":
        return <Heart size={16} className="text-error" />;
      case "post_comment":
        return <MessageSquare size={16} className="text-primary" />;
      case "friend_request":
        return <UserPlus size={16} className="text-secondary" />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 px-4">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-[1.5rem] text-primary shadow-inner">
            <Bell size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Activity</h1>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">
              Latest updates from your circle
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center py-20 opacity-20">
            <span className="loading loading-spinner loading-lg mb-4"></span>
            <p className="font-black text-xs uppercase tracking-widest">
              Syncing status
            </p>
          </div>
        ) : allNotifications.length > 0 ? (
          <AnimatePresence>
            {allNotifications.map((notif) => {
              const latestSender = notif.senders?.[0] || notif.sender;
              const notificationTime = notif.updatedAt || notif.createdAt;
              const getSafePostId = () => {
                if (!notif.post) return null;
                return typeof notif.post === "object"
                  ? notif.post._id
                  : notif.post;
              };
              const postId = getSafePostId();
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={notif._id || notif.createdAt}
                  className={`group relative bg-base-200/40 backdrop-blur-xl border ${
                    notif.isRead
                      ? "border-white/5"
                      : "border-primary/20 bg-primary/5"
                  } p-5 rounded-[2.2rem] flex items-center justify-between hover:bg-base-200 transition-all duration-300`}
                >
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          latestSender?.profilePicture ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"
                        }
                        className="w-14 h-14 rounded-2xl object-cover shadow-lg bg-base-300"
                        alt=""
                      />
                      <div className="absolute -bottom-1 -right-1 p-1.5 bg-base-100 rounded-xl shadow-md border border-white/5 text-xs">
                        {getIcon(notif.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug">
                        <span
                          className="font-black text-base-content hover:text-primary cursor-pointer transition-colors"
                          onClick={() =>
                            navigate(`/social/user/${latestSender?._id}`)
                          }
                        >
                          {latestSender?.name || "Someone"}
                        </span>

                        <span className="opacity-70 ml-1">
                          {notif.type === "post_like" &&
                            (notif.count > 1
                              ? `and ${notif.count - 1} others liked your photo`
                              : "liked your photo")}
                          {notif.type === "post_comment" &&
                            (notif.count > 1
                              ? `and ${notif.count - 1} others commented on your post`
                              : `commented: ${notif.content || ""}`)}
                          {notif.type === "friend_request" &&
                            "sent you a friend request"}
                        </span>
                      </p>

                      <div className="flex items-center gap-2 mt-1 opacity-30">
                        <Clock size={10} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                          {notificationTime
                            ? formatDistanceToNow(new Date(notificationTime), {
                                addSuffix: true,
                              })
                            : "Just now"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {notif.type === "friend_request" ? (
                      <div className="flex gap-2">
                        <Link
                          to={"/social/friends"}
                          //   onClick={() => handleRequestAction(notif._id, "accepted")}
                          className="btn btn-primary btn-sm rounded-xl font-black px-4 shadow-lg shadow-primary/20"
                        >
                          view
                        </Link>
                        <button
                          onClick={() =>
                            handleRequestAction(notif._id, "rejected")
                          }
                          className="btn btn-ghost btn-sm bg-white/5 rounded-xl hover:bg-error/10 hover:text-error"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate(`/social/post/${postId}`)}
                        className="btn btn-ghost btn-sm bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all gap-2"
                      >
                        <Eye size={16} />
                        <span className="text-[10px] font-bold uppercase">
                          View
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-base-200/20 rounded-[3.5rem] border border-dashed border-white/10"
          >
            <div className="w-20 h-20 bg-base-content/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap size={40} className="opacity-10" />
            </div>
            <h3 className="text-lg font-black opacity-40 uppercase tracking-widest">
              Inbox Zero
            </h3>
            <p className="text-xs opacity-20 font-bold mt-2">
              You are all caught up for now
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
