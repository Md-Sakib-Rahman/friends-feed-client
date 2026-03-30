import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {
  Zap,
  Image as ImageIcon,
  LayoutGrid,
  Heart,
  UserPlus,
  UserMinus, // Unfriend এর জন্য
  MessageSquare,
  Clock, // Pending এর জন্য
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast"; // নোটিফিকেশনের জন্য
import { fetchPostsByUserId } from "../../../services/postService";
import axiosInstance from "../../../services/axiosInstance";
import PostCard from "../../../features/posts/PostCard";
import PostViewModal from "../../../components/social/PostViewModal/PostViewModal";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [targetUser, setTargetUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Posts");
  const [selectedPost, setSelectedPost] = useState(null);

  // --- Friend Status States ---
  const [friendStatus, setFriendStatus] = useState("none"); // 'none', 'pending', 'friends'
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (userId === (currentUser?.id || currentUser?._id)) {
      navigate("/social/profile");
      return;
    }

    const fetchFullProfile = async () => {
      setLoading(true);
      try {
        const userRes = await axiosInstance.get(`/users/${userId}`);
        const userData = userRes.data.user;
        setTargetUser(userData);

        // ১. ফ্রেন্ডশিপ স্ট্যাটাস চেক করা
        // নোট: ব্যাকএন্ডে getUserById এ চেক করতে হবে currentUser কি অলরেডি ফ্রেন্ড কি না
        const isAlreadyFriend = userData.friends?.some(
          (f) => (f._id || f) === (currentUser?.id || currentUser?._id)
        );
        
        // এখানে একটি আলাদা এপিআই কল করা ভালো চেক করার জন্য যে রিকোয়েস্ট পেন্ডিং কি না
        // অথবা ব্যাকএন্ড থেকেই status: 'pending' রিটার্ন করা
        if (isAlreadyFriend) {
          setFriendStatus("friends");
        } else {
          // পেন্ডিং রিকোয়েস্ট চেক করার জন্য এপিআই (আপনার routes অনুযায়ী)
          const pendingRes = await axiosInstance.get("/users/requests/pending");
          const isPending = pendingRes.data.some(req => req.receiver === userId || req.sender === userId);
          if (isPending) setFriendStatus("pending");
        }

        const postRes = await fetchPostsByUserId(userId);
        setUserPosts(postRes.posts || []);
      } catch (err) {
        console.error("Profile Load Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullProfile();
  }, [userId, currentUser, navigate]);

  // --- Handlers ---
  const handleFriendAction = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (friendStatus === "none") {
        // রিকোয়েস্ট পাঠানো
        await axiosInstance.post(`/users/request/${userId}`);
        setFriendStatus("pending");
        toast.success("Friend request sent! ✨");
      } else if (friendStatus === "friends") {
        // আনফ্রেন্ড করা (এই রাউটটি আপনার ব্যাকএন্ডে তৈরি থাকতে হবে)
        await axiosInstance.post(`/users/unfriend/${userId}`);
        setFriendStatus("none");
        toast.error("User unfriended");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-bars loading-lg text-primary opacity-20"></span>
    </div>
  );

  const mediaPosts = userPosts.filter(p => p.image);

  return (
    <div className="min-h-screen relative pb-20 animate-in fade-in duration-700">
      {/* Background Glows ... */}
      
      <motion.div className="relative z-10 bg-base-100/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl overflow-hidden">
        
        {/* --- Profile Header --- */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 border-b border-white/5 pb-10 mb-10">
          <div className="relative w-40 h-40 rounded-[2.5rem] bg-base-100/80 p-1.5 ring-2 ring-white/10 shadow-inner">
              <img src={targetUser?.profilePicture} className="w-full h-full rounded-[2.3rem] object-cover shadow-lg" alt="" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter mb-2">{targetUser?.name}</h1>
            <p className="text-sm font-bold text-primary opacity-80 mb-5">@{targetUser?.username}</p>
            <p className="text-base font-medium opacity-70 leading-relaxed max-w-xl">{targetUser?.bio || "No bio available"}</p>
          </div>

          {/* Action Buttons: Dynamic States */}
          <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
            <button 
              onClick={handleFriendAction}
              disabled={friendStatus === "pending" || isProcessing}
              className={`btn btn-md rounded-2xl gap-3 font-black shadow-lg transition-all duration-300 ${
                friendStatus === "friends" 
                  ? "btn-error btn-outline hover:bg-error hover:text-white" 
                  : friendStatus === "pending"
                  ? "btn-ghost bg-white/5 opacity-50 cursor-not-allowed"
                  : "btn-primary shadow-primary/20"
              }`}
            >
              {isProcessing ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : friendStatus === "friends" ? (
                <><UserMinus size={18} /> Unfriend</>
              ) : friendStatus === "pending" ? (
                <><Clock size={18} /> Requested</>
              ) : (
                <><UserPlus size={18} /> Add Friend</>
              )}
            </button>
            
            <button className="btn btn-outline btn-md rounded-2xl gap-3 font-bold border-white/10 hover:bg-white/5">
              <MessageSquare size={18} /> Message
            </button>
          </div>
        </div>

        {/* Stats, About, and Tabs logic remains same as before... */}
        {/* ... */}
      </motion.div>

      <PostViewModal isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} post={selectedPost} />
    </div>
  );
};

export default UserProfile;
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router";
// import { useSelector } from "react-redux";
// import {
//   Zap,
//   Image as ImageIcon,
//   LayoutGrid,
//   Heart,
//   UserPlus,
//   MessageSquare,
//   Settings,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { fetchPostsByUserId } from "../../../services/postService";
// import axiosInstance from "../../../services/axiosInstance";
// import PostCard from "../../../features/posts/PostCard";
// import PostViewModal from "../../../components/social/PostViewModal/PostViewModal";

// // TabButton Component (Consistent with your own profile)
// const TabButton = ({ active, onClick, icon: Icon, label }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`relative flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 group ${
//         active
//           ? "text-primary-content"
//           : "text-base-content/70 hover:text-base-content hover:bg-white/5"
//       }`}
//     >
//       {active && (
//         <motion.div
//           layoutId="activeTabGlow"
//           className="absolute inset-0 bg-primary/80 backdrop-blur-2xl rounded-2xl shadow-lg shadow-primary/30 border border-primary/20"
//           transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
//         />
//       )}

//       <div className="relative z-10 flex items-center gap-3">
//         <Icon size={19} className={active ? "" : "opacity-60 group-hover:opacity-100 transition-opacity"} />
//         <span className="font-bold text-sm tracking-tight">{label}</span>
//       </div>
//     </button>
//   );
// };

// const UserProfile = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const { user: currentUser } = useSelector((state) => state.auth); // Logged in user for comparison
  
//   const [targetUser, setTargetUser] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("Posts");
//   const [selectedPost, setSelectedPost] = useState(null);

//   useEffect(() => {
//     if (userId === (currentUser?.id || currentUser?._id)) {
//       navigate("/social/profile");
//       return;
//     }

//     const fetchFullProfile = async () => {
//       setLoading(true);
//       try {
//         const userRes = await axiosInstance.get(`/users/${userId}`);
//         setTargetUser(userRes.data.user);

//         const postRes = await fetchPostsByUserId(userId);
//         setUserPosts(postRes.posts || []);
//       } catch (err) {
//         console.error("Profile Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFullProfile();
//   }, [userId, currentUser, navigate]);

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <span className="loading loading-bars loading-lg text-primary opacity-20"></span>
//     </div>
//   );

//   const mediaPosts = userPosts.filter(p => p.image);

//   const tabs = [
//     { icon: LayoutGrid, label: "Posts", count: userPosts.length },
//     { icon: ImageIcon, label: "Media", count: mediaPosts.length },
//     { icon: Heart, label: "Likes", count: 0 },
//   ];

//   const stats = [
//     { label: "Posts", value: userPosts.length.toString(), icon: Zap, color: "text-primary" },
//     { label: "Friends", value: `${targetUser?.friends?.length || 0}`, icon: Zap, color: "text-success" },
//   ];

//   return (
//     <div className="min-h-screen relative pb-20 animate-in fade-in duration-700">
//       {/* Animated Background Glows */}
//       <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
//       <div className="fixed bottom-[15%] left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="relative z-10 bg-base-100/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl shadow-black/30 overflow-hidden"
//       >
//         {/* Header Ambient Glow */}
//         <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-conic from-primary/20 to-secondary/20 rounded-full blur-[80px] opacity-40 translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>

//         {/* --- Profile Header --- */}
//         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 border-b border-white/5 pb-10 mb-10">
//           <div className="relative flex-shrink-0 group">
//             <div className="absolute inset-[-12px] bg-gradient-to-br from-primary via-secondary to-success rounded-[2.8rem] blur-[20px] opacity-10"></div>
//             <div className="relative w-40 h-40 rounded-[2.5rem] bg-base-100/80 p-1.5 ring-2 ring-white/10 shadow-inner">
//               <img
//                 src={targetUser?.profilePicture}
//                 className="w-full h-full rounded-[2.3rem] object-cover ring-1 ring-black/30 shadow-lg"
//                 alt={targetUser?.name}
//               />
//             </div>
//           </div>

//           <div className="flex-1 text-center md:text-left">
//             <div className="flex items-center gap-4 justify-center md:justify-start mb-2">
//               <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-base-content via-base-content/80 to-base-content/50 bg-clip-text text-transparent">
//                 {targetUser?.name}
//               </h1>
//               <div className="badge badge-secondary badge-outline text-[10px] font-black uppercase tracking-widest p-2 px-3 rounded-lg border-2">
//                 Public Profile
//               </div>
//             </div>
//             <p className="text-sm font-bold text-primary opacity-80 mb-5">@{targetUser?.username}</p>
//             <p className="text-base font-medium opacity-70 leading-relaxed max-w-xl">
//               {targetUser?.bio || "No bio available"}
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
//             <button className="btn btn-primary btn-md rounded-2xl gap-3 font-black shadow-lg shadow-primary/20 group">
//               <UserPlus size={18} className="group-hover:scale-110 transition-transform" /> Add Friend
//             </button>
//             <button className="btn btn-outline btn-md rounded-2xl gap-3 font-bold border-white/10 hover:bg-white/5">
//               <MessageSquare size={18} /> Message
//             </button>
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//           {stats.map((stat) => (
//             <div key={stat.label} className="bg-base-content/5 border border-white/5 rounded-3xl p-6 flex items-center gap-6 group cursor-default transition-all duration-300">
//               <div className={`w-14 h-14 rounded-2xl ${stat.color} bg-white/5 flex items-center justify-center border border-white/5 ring-1 ring-white/10 shadow-inner`}>
//                 <stat.icon size={28} />
//               </div>
//               <div>
//                 <p className={`text-3xl font-black tracking-tighter ${stat.color} mb-0.5`}>{stat.value}</p>
//                 <p className="text-xs font-black uppercase tracking-widest opacity-40">{stat.label}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* About Section */}
//         <div className="relative z-10 flex flex-wrap gap-x-10 gap-y-4 mb-14 bg-base-200/40 border border-white/5 p-6 px-10 rounded-[2rem] backdrop-blur-md shadow-inner">
//           <h3 className="font-bold">About {targetUser?.name?.split(' ')[0]}</h3>
//           <p className="text-sm opacity-60 leading-relaxed w-full">
//             {targetUser?.about || "This user hasn't written an 'About' section yet."}
//           </p>
//         </div>

//         {/* --- Tabs & Content Section --- */}
//         <div className="relative z-10">
//           <div className="flex items-center gap-3 bg-base-200/50 p-2.5 rounded-[2rem] border border-white/5 mb-10 max-w-md mx-auto md:mx-0 shadow-inner">
//             {tabs.map((tab) => (
//               <TabButton
//                 key={tab.label}
//                 {...tab}
//                 active={activeTab === tab.label}
//                 onClick={() => setActiveTab(tab.label)}
//               />
//             ))}
//           </div>

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//             >
//               {activeTab === "Posts" ? (
//                 <div className="space-y-6">
//                   {userPosts.length > 0 ? (
//                     userPosts.map((post) => (
//                       <PostCard key={post._id} post={post} />
//                     ))
//                   ) : (
//                     <div className="text-center py-20 bg-base-content/5 rounded-[3rem] border border-dashed border-white/10">
//                       <p className="text-xl font-black opacity-20 uppercase tracking-tighter">No Posts Available</p>
//                     </div>
//                   )}
//                 </div>
//               ) : activeTab === "Media" ? (
//                 /* Media Gallery */
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   {mediaPosts.length > 0 ? (
//                     mediaPosts.map((post) => (
//                       <motion.div
//                         key={post._id}
//                         whileHover={{ scale: 1.02 }}
//                         onClick={() => setSelectedPost(post)}
//                         className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 bg-base-300 shadow-xl"
//                       >
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-4">
//                           <span className="text-white text-xs font-bold flex items-center gap-2"><Zap size={14} className="text-primary"/> View</span>
//                         </div>
//                         <img src={post.image} alt="" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
//                       </motion.div>
//                     ))
//                   ) : (
//                     <div className="col-span-full text-center py-20 bg-base-content/5 rounded-[3rem] border border-dashed border-white/10">
//                       <p className="text-xl font-black opacity-20 uppercase tracking-tighter">No Media Shared</p>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="text-center py-40 opacity-20 font-black uppercase tracking-[0.5em]">Coming Soon</div>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </motion.div>

//       {/* Post Detail View Modal */}
//       <PostViewModal
//         isOpen={!!selectedPost}
//         onClose={() => setSelectedPost(null)}
//         post={selectedPost}
//       />
//     </div>
//   );
// };

// export default UserProfile;