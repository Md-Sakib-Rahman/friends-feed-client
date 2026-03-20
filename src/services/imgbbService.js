import axios from "axios";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY; // তোমার API Key এখানে বসাও

export const uploadImageToImgBB = async (imageFile) => {
  if (!imageFile) return null;

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData
    );

    if (response.data.success) {
      return response.data.data.url; // এটিই তোমার ইমেজের ডিরেক্ট লিঙ্ক
    }
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    throw new Error("Image upload failed");
  }
};