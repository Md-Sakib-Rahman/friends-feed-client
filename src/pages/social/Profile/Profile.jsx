import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Briefcase,
  MapPin,
  CalendarDays,
  Edit3,
  Settings,
  Zap,
  Image,
  LayoutGrid,
  Heart,
} from "lucide-react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPostsByUserId } from "../../../services/postService";
import PostCard from "../../../features/posts/PostCard";
import EditProfileModal from "../../../components/social/EditProfileModal/EditProfileModal";
import PostViewModal from "../../../components/social/PostViewModal/PostViewModal";

const TabButton = ({ active, onClick, icon: Icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 group ${
        active
          ? "text-primary-content"
          : "text-base-content/70 hover:text-base-content hover:bg-white/5"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeTabGlow"
          className="absolute inset-0 bg-primary/80 backdrop-blur-2xl rounded-2xl shadow-lg shadow-primary/30 border border-primary/20"
          transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
        />
      )}

      <div className="relative z-10 flex items-center gap-3">
        <Icon
          size={19}
          className={
            active
              ? ""
              : "opacity-60 group-hover:opacity-100 transition-opacity"
          }
        />
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
    </button>
  );
};

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("Posts");
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const tabs = [
    { icon: LayoutGrid, label: "Posts", count: 28 },
    { icon: Image, label: "Media", count: 112 },
    { icon: Heart, label: "Likes", count: "4.5K" },
  ];

  const stats = [
    {
      label: "Posts",
      value: userPosts.length.toString(),
      icon: Zap,
      color: "text-primary",
    },
    {
      label: "Friends",
      value: `${user?.friends?.length || 0}`,
      icon: Zap,
      color: "text-success",
    },
  ];
  const mediaPosts = userPosts.filter((post) => post.image);
  useEffect(() => {
    const userId = user?._id || user?.id;

    // ২. ডিব্যাগ করার জন্য কন্ডিশনের বাইরে লগ দাও
    console.log("Effect triggered! User object:", user);
    console.log("Resolved User ID:", userId);

    // ৩. কন্ডিশনে user?._id এর বদলে userId চেক করো
    if (activeTab === "Posts" && userId) {
      const loadUserPosts = async () => {
        setLoading(true);
        try {
          console.log("Making API call for ID:", userId);
          const data = await fetchPostsByUserId(userId);
          setUserPosts(data.posts || []);
        } catch (err) {
          console.error("Failed to load user posts", err);
        } finally {
          setLoading(false);
        }
      };
      loadUserPosts();
    } else {
      console.log("Condition not met:", { activeTab, hasUserId: !!userId });
    }
  }, [activeTab, user]);
  const handleDeleteFromProfile = (postId) => {
    setUserPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <div className="min-h-screen relative pb-20 animate-in fade-in duration-700">
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[15%] left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 bg-base-100/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl shadow-black/30 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-conic from-primary/30 to-secondary/30 rounded-full blur-[80px] opacity-40 translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 border-b border-white/5 pb-10 mb-10">
          <div className="relative flex-shrink-0 group">
            <div className="absolute inset-[-12px] bg-gradient-to-br from-primary via-secondary to-success rounded-[2.8rem] blur-[20px] opacity-10 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative w-40 h-40 rounded-[2.5rem] bg-base-100/80 p-1.5 ring-2 ring-white/10 shadow-inner">
              <img
                src={user?.profilePicture}
                className="w-full h-full rounded-[2.3rem] object-cover ring-1 ring-black/30 shadow-lg"
                alt={user?.name}
              />
            </div>
            <motion.button
              whileHover={{ rotate: 180 }}
              className="absolute -bottom-2 -right-2 p-2.5 rounded-full bg-secondary text-secondary-content shadow-lg shadow-secondary/20"
            >
              <Zap size={18} fill="currentColor" className="opacity-80" />
            </motion.button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start mb-2">
              <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-base-content via-base-content/80 to-base-content/50 bg-clip-text text-transparent">
                {user?.name}
              </h1>
              <div className="badge badge-primary badge-outline text-[10px] font-black uppercase tracking-widest p-2 px-3 rounded-lg border-2">
                Verified
              </div>
            </div>
            <p className="text-sm font-bold text-primary opacity-80 mb-5">
              @{user?.username}
            </p>

            <p className="text-base font-medium opacity-70 leading-relaxed max-w-xl">
              {user?.bio || "No bio available"}
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsEditModalOpen(true)} // এখানে ক্লিক ইভেন্ট দিন
              className="btn btn-outline btn-md rounded-2xl gap-3 font-bold border-white/10 hover:bg-white/5 group"
            >
              <Edit3 size={18} /> Edit Profile
            </button>
            <button className="btn btn-ghost btn-circle btn-sm opacity-30 hover:opacity-100 absolute top-6 right-6">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Stats Section   */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-base-content/5 border border-white/5 rounded-3xl p-6 flex items-center gap-6 group cursor-default transition-all duration-300 hover:border-white/10"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${stat.color} bg-white/5 flex items-center justify-center border border-white/5 ring-1 ring-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon size={28} />
              </div>
              <div>
                <p
                  className={`text-3xl font-black tracking-tighter ${stat.color} mb-0.5`}
                >
                  {stat.value}
                </p>
                <p className="text-xs font-black uppercase tracking-widest opacity-40">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Meta Section   */}
        <div className="relative z-10 flex flex-wrap gap-x-10 gap-y-4 mb-14 bg-base-200/40 border border-white/5 p-6 px-10 rounded-[2rem] backdrop-blur-md shadow-inner">
          <h3 className="font-bold">About Me</h3>
          <p className="text-sm opacity-60">
            {user?.about || "Tell us about yourself..."}
          </p>
        </div>

        {/* --- Tabs & Content Section --- */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-base-200/50 p-2.5 rounded-[2rem] border border-white/5 mb-10 max-w-md mx-auto md:mx-0 shadow-inner">
            {tabs.map((tab) => (
              <TabButton
                key={tab.label}
                {...tab}
                active={activeTab === tab.label}
                onClick={() => setActiveTab(tab.label)}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeTab === "Posts" ? (
                <div className="space-y-6">
                  {loading ? (
                    <div className="flex justify-center py-20">
                      <span className="loading loading-dots loading-lg text-primary opacity-30"></span>
                    </div>
                  ) : userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        onDelete={handleDeleteFromProfile}
                      />
                    ))
                  ) : (
                    <div className="text-center py-20 bg-base-content/5 rounded-[3rem] border border-dashed border-white/10">
                      <Zap size={40} className="mx-auto opacity-10 mb-4" />
                      <p className="text-xl font-black opacity-20 uppercase tracking-tighter">
                        No Posts Yet
                      </p>
                    </div>
                  )}
                </div>
              ) : activeTab === "Media" ? (
                /* --- Media Gallery Section --- */
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaPosts.length > 0 ? (
                    mediaPosts.map((post) => (
                      <motion.div
                        key={post._id}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPost(post)}
                        className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 bg-base-300"
                      >
                        {/* শাইন ইফেক্ট হোভারে */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-4">
                          <div className="flex items-center gap-2 text-white text-xs font-bold">
                            <Zap
                              size={14}
                              className="text-primary fill-primary"
                            />
                            View Post
                          </div>
                        </div>

                        <img
                          src={post.image}
                          alt="post-media"
                          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 bg-base-content/5 rounded-[3rem] border border-dashed border-white/10">
                      <Image size={40} className="mx-auto opacity-10 mb-4" />
                      <p className="text-xl font-black opacity-20 uppercase tracking-tighter">
                        No Media Found
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-40 opacity-20 font-black uppercase tracking-[0.5em]">
                  Coming Soon
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      <div className="...">

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentUser={user}
        />
        <PostViewModal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
      />
      </div>
    </div>
  );
};

export default Profile;
