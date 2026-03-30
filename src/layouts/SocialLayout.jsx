import React from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
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

const SocialLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Socket Context থেকে ডাইনামিক ডাটা আনা
  const { unreadCount } = useSocket(); 

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const navItems = [
    { icon: <Home size={22} />, label: "Feed", path: "/social" },
    { icon: <Search size={22} />, label: "Search", path: "/social/search" },
    { icon: <Users size={22} />, label: "Friends", path: "/social/friends" },
    {
      icon: <MessageSquare size={22} />,
      label: "Messages",
      path: "/social/messages",
      badge: 0, // পরে চ্যাট কাউন্ট এখানে বসবে
    },
    {
      icon: <Bell size={22} />,
      label: "Notifications",
      path: "/social/notifications",
      badge: unreadCount, // Socket থেকে আসা রিয়েল-টাইম কাউন্ট 🚀
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-500">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex gap-8 py-6">
          
          {/* 1. LEFT SIDEBAR (Desktop) */}
          <aside className="hidden lg:flex flex-col w-72 sticky top-6 h-[calc(100vh-48px)]">
            <div className="relative p-[1px] h-full rounded-[2.5rem] overflow-hidden group">
              <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00ff88_0%,#00bdff_50%,#00ff88_100%)] opacity-20 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative bg-base-100/60 backdrop-blur-3xl rounded-[2.5rem] p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 px-4 mb-8">
                  <div className="w-8 h-8 border-primary rounded-lg flex items-center justify-center text-primary-content font-black">
                    <img src={Logo} alt="Logo" />
                  </div>
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
                          <span className={isActive ? "" : "text-primary"}>
                            {item.icon}
                          </span>
                          <span className="font-bold text-sm">{item.label}</span>
                        </div>
                        {/* ব্যাজ যদি ০-এর বেশি হয় তবেই দেখাবে */}
                        {item.badge > 0 && (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isActive ? "bg-white text-primary" : "bg-primary/20 text-primary"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Profile & Logout */}
                <div className="mt-auto space-y-4 pt-4 border-t border-base-content/5">
                  <div className="flex items-center justify-between px-4 py-2 bg-base-200/30 rounded-2xl">
                    <span className="text-xs font-bold opacity-60">Appearance</span>
                    <ThemeController />
                  </div>

                  <Link to="/social/profile" className="flex items-center gap-3 p-2 rounded-2xl hover:bg-base-200/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 overflow-hidden ring-1 ring-primary/20">
                      <img
                        src={user?.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg"}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-bold text-xs truncate">{user?.name}</p>
                      <p className="text-[10px] opacity-50 truncate">@{user?.username}</p>
                    </div>
                  </Link>

                  <button
                    onClick={() => dispatch(logout())}
                    className="btn btn-error btn-ghost btn-block btn-sm rounded-xl gap-2 justify-start hover:bg-error/10"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* 2. MAIN CONTENT AREA */}
          <main className="flex-1 max-w-2xl mx-auto w-full pb-32 lg:pb-0">
            {/* Mobile Header */}
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

          {/* 3. RIGHT SIDEBAR (Active Contacts) */}
          <aside className="hidden xl:flex flex-col w-80 sticky top-6 h-[calc(100vh-48px)]">
            <div className="relative p-[1px] h-full rounded-[2.5rem] overflow-hidden group">
              <div className="absolute inset-[-1000%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0088_0%,#7000ff_50%,#ff0088_100%)] opacity-10 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-base-100/60 backdrop-blur-3xl rounded-[2.5rem] p-6 h-full flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6 px-2 italic">Active Friends</p>
                <div className="space-y-4 overflow-y-auto no-scrollbar flex-1">
                   {/* বন্ধুদের অনলাইন স্ট্যাটাস পরবর্তীতে এখানে ডাইনামিক হবে */}
                   <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                      <Zap size={32} className="mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Connect with others</p>
                   </div>
                </div>
                <Link to="/social/friends" className="btn btn-ghost btn-sm mt-auto text-primary rounded-xl font-bold">Manage Connections</Link>
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
            <Link
              key={item.label}
              to={item.path}
              className={`p-2.5 rounded-2xl transition-all relative ${
                isActive ? "bg-primary text-primary-content shadow-lg shadow-primary/30" : "opacity-40"
              }`}
            >
              {item.icon}
              {/* মোবাইল মেনুতেও ডাইনামিক ব্যাজ */}
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
// import React from "react";
// import { Outlet, Navigate, Link, useLocation } from "react-router";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   Home,
//   Search,
//   Users,
//   MessageSquare,
//   Bell,
//   LogOut,
//   Hash,
//   Zap,
// } from "lucide-react";
// import { logout } from "../features/auth/authSlice";
// import ThemeController from "../components/shared/ThemeController/ThemeController";
// import Logo from "../assets/logo.png";
// import { useSocket } from "../Context/SocketContext";

// const SocialLayout = () => {
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const { unreadCount } = useSocket();
//   if (!isAuthenticated) return <Navigate to="/login" replace />;

//   const navItems = [
//     { icon: <Home size={22} />, label: "Feed", path: "/social" },
//     { icon: <Search size={22} />, label: "Search", path: "/social/search" },
//     { icon: <Users size={22} />, label: "Friends", path: "/social/friends" },
//     {
//       icon: <MessageSquare size={22} />,
//       label: "Messages",
//       path: "/social/messages",
//       badge: 3,
//     },
//     {
//       icon: <Bell size={22} />,
//       label: "Notifications",
//       path: "/social/notifications",
//       badge: unreadCount,  
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-500">
//       {/* --- Ambient Background Glows --- */}
//       <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
//       <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none"></div>

//       <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
//         <div className="flex gap-8 py-6">
//           {/* 1. LEFT SIDEBAR (Desktop) */}
//           <aside className="hidden lg:flex flex-col w-72 sticky top-6 h-[calc(100vh-48px)]">
//             {/* Animated Border Wrapper */}
//             <div className="relative p-[1px] h-full rounded-[2.5rem] overflow-hidden group">
//               {/* The Rotating Border Element */}
//               <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00ff88_0%,#00bdff_50%,#00ff88_100%)] opacity-20 group-hover:opacity-100 transition-opacity duration-500"></div>

//               {/* Glass Inner Content */}
//               <div className="relative bg-base-100/60 backdrop-blur-3xl rounded-[2.5rem] p-6 flex flex-col h-full">
//                 <div className="flex items-center gap-2 px-4 mb-8">
//                   <div className="w-8 h-8 border-primary rounded-lg flex items-center justify-center text-primary-content font-black">
//                     <img src={Logo} alt="" />
//                   </div>
//                   <span className="text-xl font-black tracking-tighter">
//                     FriendsFeed
//                   </span>
//                 </div>

//                 <div className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
//                   {navItems.map((item) => (
//                     <Link
//                       key={item.label}
//                       to={item.path}
//                       className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
//                         location.pathname === item.path
//                           ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
//                           : "hover:bg-base-200/50"
//                       }`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <span
//                           className={
//                             location.pathname === item.path
//                               ? ""
//                               : "text-primary"
//                           }
//                         >
//                           {item.icon}
//                         </span>
//                         <span className="font-bold text-sm">{item.label}</span>
//                       </div>
//                       {item.badge && (
//                         <span
//                           className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
//                             location.pathname === item.path
//                               ? "bg-white text-primary"
//                               : "bg-primary/20 text-primary"
//                           }`}
//                         >
//                           {item.badge}
//                         </span>
//                       )}
//                     </Link>
//                   ))}
//                 </div>

//                 {/* Desktop Theme Switcher & Logout */}
//                 <div className="mt-auto space-y-4 pt-4 border-t border-base-content/5">
//                   <div className="flex items-center justify-between px-4 py-2 bg-base-200/30 rounded-2xl">
//                     <span className="text-xs font-bold opacity-60">
//                       Appearance
//                     </span>
//                     <ThemeController />
//                   </div>

//                   <Link
//                     to="/social/profile"
//                     className="flex items-center gap-3 p-2 rounded-2xl hover:bg-base-200/50"
//                   >
//                     <div className="w-10 h-10 rounded-xl bg-primary/10 overflow-hidden ring-1 ring-primary/20">
//                       <img
//                         src={user?.profilePicture || null}
//                         alt={user?.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="flex-1 truncate">
//                       <p className="font-bold text-xs truncate">{user?.name}</p>
//                       <p className="text-[10px] opacity-50 truncate">
//                         @{user?.username}
//                       </p>
//                     </div>
//                   </Link>

//                   <button
//                     onClick={() => dispatch(logout())}
//                     className="btn btn-error btn-ghost btn-block btn-sm rounded-xl gap-2 justify-start"
//                   >
//                     <LogOut size={18} /> Logout
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* 2. MIDDLE FEED AREA */}
//           <main className="flex-1 max-w-2xl mx-auto w-full pb-32 lg:pb-0">
//             {/* Mobile Header with Theme Switcher */}
//             <div className="lg:hidden flex items-center justify-between mb-6 bg-base-100/40 backdrop-blur-2xl p-4 rounded-3xl border border-white/5 shadow-xl fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-sm z-50 ">
//               <Link to="/social" className="flex items-center gap-2">
//                 <div className="w-8 h-8 border-primary rounded-lg flex items-center justify-center text-primary-content font-black">
//                   <img src={Logo} alt="" />
//                 </div>
//                 <span className="text-lg font-black tracking-tighter">
//                   FriendsFeed
//                 </span>
//               </Link>
//               <div className="flex items-center gap-3">
//                 <ThemeController />
//                 <Link
//                   to="/social/profile"
//                   className="w-9 h-9 rounded-full ring-2 ring-primary/20 bg-base-300"
//                 >
//                   <img
//                     src={user?.profilePicture || null}
//                     alt={user?.name}
//                     className="w-full h-full rounded-full object-cover"
//                   />
//                 </Link>
//                 <button
//                   onClick={() => dispatch(logout())}
//                   className="btn-error btn btn-ghost btn-sm rounded-full p-2"
//                 >
//                   <LogOut size={18} />
//                 </button>
//               </div>
//             </div>

//             <div className="max-lg:pt-20">
//               <Outlet />
//             </div>
//           </main>

//           {/* 3. RIGHT SIDEBAR (Desktop Contacts) */}
//           <aside className="hidden xl:flex flex-col w-80 sticky top-6 h-[calc(100vh-48px)]">
//             <div className="relative p-[1px] h-full rounded-[2.5rem] overflow-hidden group">
//               <div className="absolute inset-[-1000%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0088_0%,#7000ff_50%,#ff0088_100%)] opacity-10 group-hover:opacity-60 transition-opacity"></div>

//               <div className="relative bg-base-100/60 backdrop-blur-3xl rounded-[2.5rem] p-6 h-full flex flex-col">
//                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6 px-2">
//                   Active Friends
//                 </p>
//                 <div className="space-y-4 overflow-y-auto no-scrollbar pr-1">
//                   {[1, 2, 3, 4, 5, 6].map((i) => (
//                     <div
//                       key={i}
//                       className="flex items-center gap-3 p-2 rounded-2xl hover:bg-base-200/50 cursor-pointer transition-all"
//                     >
//                       <div className="relative">
//                         <img
//                           src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
//                           className="w-10 h-10 rounded-xl bg-base-300 shadow-sm"
//                           alt=""
//                         />
//                         <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-base-100"></span>
//                       </div>
//                       <span className="text-sm font-bold opacity-80">
//                         Friend {i}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//                 <button className="btn btn-ghost btn-sm mt-auto text-primary">
//                   View All Contacts
//                 </button>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </div>

//       {/* 4. MOBILE BOTTOM DOCKED MENU */}
//       <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm h-16 bg-base-100/60 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl z-50 flex items-center justify-around px-2">
//         {navItems.map((item) => (
//           <Link
//             key={item.label}
//             to={item.path}
//             className={`p-2.5 rounded-2xl transition-all relative ${
//               location.pathname === item.path
//                 ? "bg-primary text-primary-content shadow-lg shadow-primary/30"
//                 : "opacity-40"
//             }`}
//           >
//             {item.icon}
//             {item.badge && location.pathname !== item.path && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[8px] text-white flex items-center justify-center rounded-full border border-base-100 font-bold">
//                 {item.badge}
//               </span>
//             )}
//           </Link>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default SocialLayout;
