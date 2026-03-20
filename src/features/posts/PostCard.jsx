import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
  AlertTriangle,
  X,
  Clock,
} from "lucide-react";
import { toggleLikePost, deletePostById, fetchCommentsByPostId } from "../../services/postService.js";
import { useSelector } from "react-redux";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import CommentSection from "../../components/social/comments/CommentSection";
import { useNavigate } from "react-router";
const PostCard = ({ post, onDelete }) => {
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id || user?._id;
  const navigate = useNavigate();
  
  // --- States ---
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(post.likes?.some((id) => id === currentUserId));

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleProfileClick = () => {
    const authorId = post.author?._id || post.author?.id;
    if (authorId === currentUserId) {
      navigate("/profile");
    } else {
      navigate(`/social/user/${authorId}`);
    }
  };
  // --- Effects ---
  useEffect(() => {
    setLikes(post.likes || []);
    setIsLiked(post.likes?.some((id) => id === currentUserId));
  }, [post.likes, currentUserId]);

  useEffect(() => {
    if (showComments) {
      const loadComments = async () => {
        setIsCommentsLoading(true);
        try {
          const data = await fetchCommentsByPostId(post._id);
          setComments(data);
        } catch (err) {
          console.error("Failed to load comments", err);
        } finally {
          setIsCommentsLoading(false);
        }
      };
      loadComments();
    }
  }, [showComments, post._id]);

  // --- Handlers ---
  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
    setCommentCount((prev) => prev + 1);
  };

  const handleLike = async () => {
    try {
      const res = await toggleLikePost(post._id);
      setLikes(res.likes);
      setIsLiked(res.isLiked);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deletePostById(post._id);
      toast.success("Post vanished!", { icon: "🗑️" });
      setShowDeleteModal(false);
      if (onDelete) onDelete(post._id);
    } catch (err) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-base-100/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-6 mb-6 shadow-2xl group transition-all hover:bg-base-100/50 relative">
      
      {/* 1. Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div onClick={handleProfileClick} className="w-11 h-11 rounded-2xl bg-base-300 overflow-hidden ring-2 ring-primary/10">
            <img
              src={post.author?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.name}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 onClick={handleProfileClick} className="font-bold text-sm tracking-tight">{post.author?.name}</h4>
            <div className="flex items-center gap-1.5 opacity-40 uppercase text-[9px] font-black tracking-widest">
              <Clock size={10} />
              <span>{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal size={20} />
          </label>
          <ul tabIndex={0} className="dropdown-content z-[10] menu p-2 shadow-2xl bg-base-100/80 backdrop-blur-3xl border border-white/10 rounded-2xl w-44 mt-2">
            {(user?.id === post.author?._id || user?._id === post.author?._id) ? (
              <li>
                <button onClick={() => setShowDeleteModal(true)} className="text-error font-bold text-xs gap-3 py-3">
                  <Trash2 size={16} /> Delete Post
                </button>
              </li>
            ) : (
              <li><button className="font-bold text-xs gap-3 py-3">Report Post</button></li>
            )}
          </ul>
        </div>
      </div>

      {/* 2. Content Section */}
      <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap px-1">{post.content}</p>
      {post.image && (
        <div className="rounded-[2rem] overflow-hidden mb-4 border border-white/5 shadow-inner">
          <img src={post.image} alt="" className="w-full h-auto max-h-[500px] object-cover" loading="lazy" />
        </div>
      )}

      {/* 3. Actions Section */}
      <div className="flex items-center gap-6 mt-6">
        {/* Like Button */}
        <button onClick={handleLike} className={`flex items-center gap-2 group/btn transition-all ${isLiked ? "text-red-500 scale-105" : "opacity-60 hover:opacity-100"}`}>
          <div className="relative flex items-center justify-center">
            <AnimatePresence>
              {isLiked && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5, opacity: 0 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-500 rounded-full blur-sm" />
              )}
            </AnimatePresence>
            <motion.div whileTap={{ scale: 0.7 }} animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }} className={`p-2 rounded-xl ${isLiked ? "bg-red-500/10" : "group-hover/btn:bg-base-content/10"}`}>
              <Heart size={20} fill={isLiked ? "#ef4444" : "none"} />
            </motion.div>
          </div>
          <span className="text-xs font-black">{likes.length}</span>
        </button>

        {/* Comment Toggle Button */}
        <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 transition-all ${showComments ? "text-secondary opacity-100" : "opacity-60 hover:opacity-100"}`}>
          <div className={`p-2 rounded-xl ${showComments ? "bg-secondary/10" : "hover:bg-secondary/10"}`}>
            <MessageCircle size={20} />
          </div>
          <span className="text-xs font-black">{commentCount}</span>
        </button>

        <button className="flex items-center gap-2 opacity-60 hover:opacity-100 group/btn transition-all ml-auto">
          <div className="p-2 rounded-xl group-hover/btn:bg-base-content/10 transition-all"><Share2 size={20} /></div>
        </button>
      </div>

      {/* 4. Comments Area (Animated) */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 border-t border-white/5 pt-4">
            <CommentSection postId={post._id} onCommentAdded={handleCommentAdded} />
            
            <div className="mt-6 space-y-5 max-h-[300px] overflow-y-auto no-scrollbar pb-2">
              {isCommentsLoading ? (
                <div className="flex justify-center py-4"><span className="loading loading-dots loading-sm opacity-20"></span></div>
              ) : (
                comments.map((comment) => (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={comment._id} className="flex gap-3 px-1">
                    <img 
                      src={comment.author?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.author?.name}`} 
                      className="w-8 h-8 rounded-lg object-cover bg-base-300" 
                      alt="" 
                    />
                    <div className="flex-1 bg-white/5 rounded-2xl px-4 py-2.5 border border-white/5">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-bold text-primary">@{comment.author?.username || comment.author?.name}</span>
                        <span className="text-[9px] opacity-30">{moment(comment.createdAt).fromNow()}</span>
                      </div>
                      <p className="text-xs opacity-80 leading-snug">{comment.content}</p>
                    </div>
                  </motion.div>
                ))
              )}
              {!isCommentsLoading && comments.length === 0 && (
                <p className="text-center text-[10px] opacity-20 py-4 uppercase tracking-widest">No comments yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-base-100/70 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl overflow-hidden">
              <div className="absolute top-[-20%] left-[-20%] w-40 h-40 bg-error/20 rounded-full blur-[60px] pointer-events-none"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-5 ring-1 ring-error/20">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-lg font-black mb-2">Delete Post?</h3>
                <p className="text-xs opacity-50 mb-8 px-4 leading-relaxed">This action cannot be undone. Your thoughts will vanish from the feed forever.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={confirmDelete} disabled={isDeleting} className="btn btn-error btn-md rounded-xl font-black gap-2">
                    {isDeleting ? <span className="loading loading-spinner" /> : "Delete Forever"}
                  </button>
                  <button onClick={() => setShowDeleteModal(false)} className="btn btn-ghost btn-md rounded-xl font-bold opacity-50">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCard;
