import axiosInstance from "./axiosInstance";

export const searchPeople = async (query) => {
  try {
    const res = await axiosInstance.get(`/users/search?query=${query}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || "Search failed";
  }
};