import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Hammer, ChevronLeft, Construction, Zap } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- Ambient Background Glows --- */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full text-center relative z-10"
      >
        {/* Animated Icon Container */}
        <div className="relative inline-block mb-8">
          <motion.div 
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary ring-1 ring-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20"
          >
            <Construction size={48} strokeWidth={1.5} />
          </motion.div>
          
          {/* Decorative Sparkle */}
          <motion.div 
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 text-secondary"
          >
            <Zap size={24} fill="currentColor" />
          </motion.div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-black tracking-tighter mb-4 bg-gradient-to-r from-base-content to-base-content/40 bg-clip-text text-transparent">
          Paving the Way...
        </h1>
        <p className="text-sm opacity-50 font-medium leading-relaxed mb-10 px-6">
          This corner of the <span className="text-primary font-bold">FriendsFeed</span> universe is currently under construction. We're building something amazing for you!
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-3">
          <Link 
            to="/social" 
            className="btn btn-primary btn-lg rounded-2xl font-black gap-2 shadow-lg shadow-primary/20 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Feed
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-ghost btn-md rounded-2xl opacity-40 hover:opacity-100 font-bold transition-all"
          >
            Retry Connection
          </button>
        </div>

        {/* Bottom Tag */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20">
            Error Code: 404_BUILDING_DREAMS
          </p>
        </div>
      </motion.div>

      {/* Floating Glass Bits */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/4 right-[15%] w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hidden lg:block"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-1/4 left-[15%] w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hidden lg:block"
      />
    </div>
  );
};

export default NotFound;