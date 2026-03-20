import React, { useState } from "react";
import { Send, Smile } from "lucide-react";
import { useSelector } from "react-redux";
import { addCommentToPost } from "../../../services/postService";
import toast from "react-hot-toast";

const CommentSection = ({ postId, onCommentAdded }) => {
  const { user } = useSelector((state) => state.auth);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newComment = await addCommentToPost(postId, text);
      setText("");
      onCommentAdded(newComment);  
      toast.success("Comment posted!");
    } catch (err) {
      toast.error("Could not post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/5">
      <div className="flex gap-3">
        {/* User Avatar */}
        <div className="w-9 h-9 rounded-xl bg-base-300 overflow-hidden flex-shrink-0 ring-1 ring-primary/20">
          <img
            src={user?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex-1 relative group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-base-content/5 border border-white/5 rounded-2xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:opacity-30"
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button 
              type="button" 
              className="p-1.5 opacity-30 hover:opacity-100 transition-opacity"
            >
              <Smile size={18} />
            </button>
            <button
              type="submit"
              disabled={!text.trim() || isSubmitting}
              className={`p-1.5 rounded-lg transition-all ${
                text.trim() ? "text-primary scale-110" : "opacity-20"
              }`}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;