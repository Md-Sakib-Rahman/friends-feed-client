import React, { useEffect, useState, useMemo } from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Users,
  MessageSquare,
  Bell,
  LogOut,
  Zap,
} from "lucide-react";
import { logout } from "../features/auth/authSlice";
import ThemeController from "../components/shared/ThemeController/ThemeController";
import Logo from "../assets/logo.png";
import { useSocket } from "../Context/SocketContext";
import axiosInstance from "../services/axiosInstance";

const SocialLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  const { unreadCount, onlineUsers, msgUnreadCount, socket } = useSocket();
  const [friends, setFriends] = useState([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const onlineSet = useMemo(() => new Set(onlineUsers), [onlineUsers]);
  const loadFriends = async () => {
    try {
      const res = await axiosInstance.get("/users/friends/list");
      setFriends(res.data);
    } catch (err) {
      console.error("Error loading friends:", err);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadFriends();

      if (socket) {
        socket.on("FRIEND_ADDED", loadFriends);
        socket.on("FRIEND_REMOVED", loadFriends);
      }
    }

    return () => {
      socket?.off("FRIEND_ADDED");
      socket?.off("FRIEND_REMOVED");
    };
  }, [user, socket]);

 const activeFriends = useMemo(() => {
  return friends.filter((f) => onlineSet.has(f._id || f.id));
}, [friends, onlineSet])

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const navItems = [
    { icon: <Home size={22} />, label: "Feed", path: "/social" },
    { icon: <Search size={22} />, label: "Search", path: "/social/search" },
    { icon: <Users size={22} />, label: "Friends", path: "/social/friends" },
    {
      icon: <MessageSquare size={22} />,
      label: "Messages",
      path: "/social/messages",
      badge: msgUnreadCount,  
    },
    {
      icon: <Bell size={22} />,
      label: "Notifications",
      path: "/social/notifications",
      badge: unreadCount,
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-500 ">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex items-start gap-8 py-6">
          
          {/* 1. LEFT SIDEBAR (Desktop) */}
          <aside className="hidden lg:flex flex-col w-72 sticky top-6 h-[calc(100vh-48px)] ">
            <div className="relative p-[1px] h-full rounded-[2.5rem] overflow-hidden group">
              <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00ff88_0%,#00bdff_50%,#00ff88_100%)] opacity-20 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative bg-base-100/60 backdrop-blur-3xl rounded-[2.5rem] p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 px-4 mb-8">
                  <img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
                  <span className="text-xl font-black tracking-tighter">FriendsFeed</span>
                </div>

                <div className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                          isActive
                            ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                            : "hover:bg-base-200/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={isActive ? "" : "text-primary"}>{item.icon}</span>
                          <span className="font-bold text-sm">{item.label}</span>
                        </div>
                        {item.badge > 0 && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? "bg-white text-primary" : "bg-primary/20 text-primary"}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-auto space-y-4 pt-4 border-t border-base-content/5">
                  <div className="flex items-center justify-between px-4 py-2 bg-base-200/30 rounded-2xl">
                    <span className="text-xs font-bold opacity-60">Appearance</span>
                    <ThemeController />
                  </div>

                  <Link to="/social/profile" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-base-200/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 overflow-hidden ring-1 ring-primary/20">
                      <img src={user?.profilePicture} alt={user?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-bold text-xs truncate">{user?.name}</p>
                      <p className="text-[10px] opacity-50 truncate">@{user?.username}</p>
                    </div>
                  </Link>

                  <button onClick={() => dispatch(logout())} className="btn btn-error btn-ghost btn-block btn-sm rounded-xl gap-2 justify-start hover:bg-error/10 font-bold">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* 2. MAIN CONTENT AREA */}
          <main className="flex-1 max-w-2xl mx-auto w-full pb-32 lg:pb-0">
            <div className="lg:hidden flex items-center justify-between mb-6 bg-base-100/40 backdrop-blur-2xl p-4 rounded-3xl border border-white/5 shadow-xl fixed top-4 left-1/2 -translate-x-1/2 w-[90%] z-50">
              <Link to="/social" className="flex items-center gap-2">
                <img src={Logo} className="w-7 h-7" alt="" />
                <span className="text-lg font-black tracking-tighter text-primary">FriendsFeed</span>
              </Link>
              <div className="flex items-center gap-3">
                <ThemeController />
                <Link to="/social/profile" className="w-9 h-9 rounded-full ring-2 ring-primary/20 overflow-hidden">
                  <img src={user?.profilePicture} className="w-full h-full object-cover" alt="" />
                </Link>
              </div>
            </div>
            <div className="max-lg:pt-20">
              <Outlet />
            </div>
          </main>

          {/* 3. RIGHT SIDEBAR (Real-time Active Contacts) */}
          <aside className="hidden xl:flex flex-col w-80 sticky top-6 h-[calc(100vh-48px)]">
            <div className="relative p-[1px] h-full rounded-[2.5rem] overflow-hidden group">
              <div className="absolute inset-[-1000%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0088_0%,#7000ff_50%,#ff0088_100%)] opacity-10 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-base-100/60 backdrop-blur-3xl rounded-[2.5rem] p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6 px-2">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Active Friends</p>
                  {activeFriends.length > 0 && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {activeFriends.length > 0 ? (
                      activeFriends.map((friend) => (
                        <motion.div
                          key={friend._id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to={`/social/messages/${friend._id}`}
                            className="flex items-center gap-3 p-3 rounded-[1.8rem] hover:bg-base-200/50 transition-all group/friend border border-transparent hover:border-white/5 shadow-sm hover:shadow-xl"
                          >
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 rounded-2xl bg-base-300 overflow-hidden ring-2 ring-primary/5 group-hover/friend:ring-primary/20 transition-all">
                                <img src={friend.profilePicture} className="w-full h-full object-cover" alt={friend.name} />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-base-100 shadow-lg"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-[13px] truncate group-hover/friend:text-primary transition-colors">{friend.name}</p>
                              <p className="text-[9px] font-black uppercase opacity-30 tracking-tighter">Active Now</p>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center opacity-0 group-hover/friend:opacity-100 transition-all text-primary">
                              <MessageSquare size={14} />
                            </div>
                          </Link>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-center py-10 bg-base-200/20 rounded-[2.5rem] border border-dashed border-white/5"
                      >
                        <Zap size={24} className="mx-auto mb-2 opacity-10" />
                        <p className="text-[10px] font-bold uppercase opacity-20 tracking-widest">No friends active</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/social/friends" className="btn btn-ghost btn-sm mt-auto text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/10">
                  Manage Connections
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 4. MOBILE BOTTOM DOCKED MENU */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm h-16 bg-base-100/60 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl z-50 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.label} to={item.path} className={`p-2.5 rounded-2xl transition-all relative ${isActive ? "bg-primary text-primary-content shadow-lg shadow-primary/30" : "opacity-40"}`}>
              {item.icon}
              {item.badge > 0 && !isActive && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[10px] text-white flex items-center justify-center rounded-full border-2 border-base-100 font-black animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SocialLayout;
