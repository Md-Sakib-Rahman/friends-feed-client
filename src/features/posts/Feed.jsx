import React, { useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import { fetchPosts } from "../../services/postService";
import SelectedPostModal from "../../components/social/SelectedPostModal/SelectedPostModal"
const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const loadPosts = async (isInitial = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await fetchPosts(isInitial ? "" : cursor);
      if (isInitial) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(true);
  }, []);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  return (
    <div className="animate-in fade-in duration-700">
      <CreatePost onPostCreated={handleNewPost} />
      
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard 
            key={post._id} 
            post={post} 
            onDelete={handleDeletePost}  
            onImageClick={() => setSelectedPost(post)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center py-10">
          <button 
            onClick={() => loadPosts()}
            disabled={loading}
            className="btn btn-ghost btn-sm text-primary font-black uppercase tracking-widest"
          >
            {loading ? <span className="loading loading-dots"></span> : "Load More"}
          </button>
        </div>
      )}
      <SelectedPostModal 
  post={selectedPost} 
  onClose={() => setSelectedPost(null)} 
/>
    </div>
  );
};

export default Feed;
