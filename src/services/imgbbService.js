import axios from "axios";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const optimizeImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;  
        const MAX_HEIGHT = 1200;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/webp",
          0.7 
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const uploadImageToImgBB = async (imageFile) => {
  if (!imageFile) return null;

  try {
    const optimizedBlob = await optimizeImage(imageFile);

    const formData = new FormData();
    formData.append("image", optimizedBlob, "optimized_image.webp");

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData
    );

    if (response.data.success) {
      return response.data.data.url;
    }
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    throw new Error("Image optimization or upload failed");
  }
};
// import axios from "axios";

// const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY; // তোমার API Key এখানে বসাও

// export const uploadImageToImgBB = async (imageFile) => {
//   if (!imageFile) return null;

//   const formData = new FormData();
//   formData.append("image", imageFile);

//   try {
//     const response = await axios.post(
//       `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
//       formData
//     );

//     if (response.data.success) {
//       return response.data.data.url; // এটিই তোমার ইমেজের ডিরেক্ট লিঙ্ক
//     }
//   } catch (error) {
//     console.error("ImgBB Upload Error:", error);
//     throw new Error("Image upload failed");
//   }
// };