import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PostCard from "../../../features/posts/PostCard";

const SelectedPostModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop with Blur */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-base-300/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-base-100 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <button 
            onClick={onClose}
            className="absolute top-9 right-18 z-10 p-2 bg-base-200 rounded-full hover:bg-error hover:text-white transition-colors"
          >
            <X size={17} />
          </button>
          
          <div className="p-2">
            <PostCard post={post} isModal={true} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SelectedPostModal;