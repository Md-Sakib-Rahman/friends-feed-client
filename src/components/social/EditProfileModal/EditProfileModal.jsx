import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, User, PenTool, Globe, CheckCircle2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../../services/axiosInstance";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../features/auth/authSlice";

const EditProfileModal = ({ isOpen, onClose, currentUser }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    about: currentUser?.about || "",
    profilePicture: currentUser?.profilePicture || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axiosInstance.patch("/users/profile", formData);
      console.log("Sending Data:", formData)
      dispatch(setCredentials({ 
        user: res.data.user, 
        accessToken: localStorage.getItem("token") 
      }));
      toast.success("Identity Matrix Synced", {
        icon: "✨",
        style: { borderRadius: '20px', background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative p-[1.5px] overflow-hidden rounded-[2.5rem] w-full max-w-2xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_150deg,var(--p)_180deg,transparent_210deg,transparent_360deg)]"
              style={{ "--p": "oklch(var(--p))" }} // DaisyUI primary color
            />

            <div className="relative bg-base-100/95 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden z-10">
              
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-20 -left-20 w-80 h-80 bg-primary/30 rounded-full blur-[100px] pointer-events-none"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/30 rounded-full blur-[100px] pointer-events-none"
              />

              {/* Header */}
              <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary animate-pulse">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight uppercase italic text-primary">Update Profile</h2>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-error/10 hover:text-error transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="relative z-10 p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Profile Image Uplink */}
                <div className="md:col-span-2 flex justify-center mb-2">
                  <div className="relative group">
                    
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden ring-2 ring-primary/20 bg-base-300 relative z-10">
                      <img src={formData.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <label className="absolute inset-0 z-20 flex items-center justify-center bg-primary/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-[2rem]">
                      <Camera size={24} className="text-white" />
                      <input 
                        type="text" 
                        className="hidden" 
                        onChange={(e) => setFormData({...formData, profilePicture: e.target.value})}
                      />
                    </label>
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Full Name</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="Real Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">UserName</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 text-sm font-bold">@</span>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:border-secondary/50 transition-all"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows="2"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none"
                    placeholder="Write your Bio ...."
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">About</label>
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData({...formData, about: e.target.value})}
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 text-sm focus:outline-none focus:border-secondary/50 transition-all resize-none"
                    placeholder="Write about yourself..."
                  />
                </div>

                {/* Save Button */}
                <div className="md:col-span-2 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden group py-4 bg-primary rounded-2xl font-black text-white uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg"
                  >
                    {loading ? <span className="loading loading-bars loading-sm"></span> : "Overwrite Identity"}
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;