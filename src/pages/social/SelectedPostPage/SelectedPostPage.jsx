import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axiosInstance from "../../../services/axiosInstance";
import PostCard from "../../../features/posts/PostCard";  
import { ArrowLeft, Loader2 } from "lucide-react";

const SelectedPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity">
        <ArrowLeft size={18} /> Back
      </button>
      {post ? <PostCard post={post} /> : <p>Post not found</p>}
    </div>
  );
};

export default SelectedPostPage;