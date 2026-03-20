import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PostCard from "../../../features/posts/PostCard";

const PostViewModal = ({ isOpen, onClose, post }) => {
  return (
    <AnimatePresence>
      {isOpen && post && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] no-scrollbar"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-primary transition-colors"
            >
              <X size={20} />
            </button>
            <PostCard post={post} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostViewModal;