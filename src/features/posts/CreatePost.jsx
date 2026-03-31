import React, { useState } from "react";
import { Image, Send, Smile, Paperclip } from "lucide-react";
import { useSelector } from "react-redux";
import { uploadImageToImgBB } from "../../services/imgbbService";
import { createNewPost } from "../../services/postService";
import toast from "react-hot-toast";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handlePost = async () => {
    if (!content.trim() && !image) {
    toast.error("Please add some text or an image");
    return;
  };
    setUploading(true);
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImageToImgBB(image);
      }
      const newPost = await createNewPost({ content: content.trim(), image: imageUrl });
      onPostCreated(newPost);
      setContent("");
      setImage(null);
      toast.success("Post shared!");
    } catch (err) {
      toast.error("Failed to post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-base-100/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-4 mb-6 shadow-xl">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 shrink-0 overflow-hidden border border-primary/20">
          <img src={user?.profilePicture} alt="" className="w-full h-full object-cover" />
        </div>
        <textarea
          placeholder={`What's on your mind, ${user?.name.split(" ")[0]}?`}
          className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 resize-none h-20 no-scrollbar outline-primary"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {image && (
        <div className="relative mt-4 rounded-2xl overflow-hidden h-48 border border-white/10">
          <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" alt="" />
          <button onClick={() => setImage(null)} className="absolute top-2 right-2 btn btn-circle btn-xs btn-error">×</button>
        </div>
      )}

      <div className="divider opacity-5 my-2"></div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <label className="btn btn-ghost btn-sm rounded-xl text-primary gap-2">
            <Image size={18} /> <span className="hidden sm:inline">Photo</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </label>
          <button className="btn btn-ghost btn-sm rounded-xl text-secondary gap-2">
            <Smile size={18} /> <span className="hidden sm:inline">Feeling</span>
          </button>
        </div>
        <button 
          onClick={handlePost}
          disabled={uploading || (!content && !image)}
          className="btn btn-primary btn-sm rounded-xl px-6 gap-2 shadow-lg shadow-primary/20"
        >
          {uploading ? <span className="loading loading-spinner loading-xs"></span> : <><Send size={16} /> Post</>}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;