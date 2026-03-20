import axiosInstance from "./axiosInstance";

export const fetchPosts = async (cursor = "") => {
  const response = await axiosInstance.get(`/posts?cursor=${cursor}`);
  return response.data;
};

export const createNewPost = async (postData) => {
  const response = await axiosInstance.post("/posts", postData);
  return response.data;
};

export const toggleLikePost = async (postId) => {
  const response = await axiosInstance.put(`/posts/${postId}/like`);
  return response.data;
};

export const deletePostById = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}`);
  return response.data;
};
export const addCommentToPost = async (postId, content) => {
  const response = await axiosInstance.post(`/posts/${postId}/comments`, { content });
  return response.data;
};
export const fetchCommentsByPostId = async (postId) => {
  const response = await axiosInstance.get(`/posts/${postId}/comments`);
  return response.data;
};
export const fetchPostsByUserId = async (userId, cursor = "") => {
  const response = await axiosInstance.get(`/posts/user/${userId}?cursor=${cursor}`);
  return response.data;
};