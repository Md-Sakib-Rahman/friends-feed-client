import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  UserPlus,
  Github,
  Chrome,
  ShieldCheck,
  Camera,
  X,
} from "lucide-react";
import { uploadImageToImgBB } from "../../services/imgbbService";
import { registerUser } from "../../services/authService";
import { setCredentials, setLoading } from "./authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setValue("profilePic", e.target.files);
    }
  };
  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));

      let imageUrl = "";
      if (data.profilePic && data.profilePic[0]) {
        toast.loading("Uploading image...");
        imageUrl = await uploadImageToImgBB(data.profilePic[0]);
      }

      const finalData = {
        name: data.name,
        email: data.email,
        username: data.username.toLowerCase(),
        password: data.password,
        profilePicture: imageUrl,
      };

      const result = await registerUser(finalData);

      // dispatch(setCredentials(result));
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      setApiError(errorMessage);
      toast.error(error.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)]  flex items-center justify-center p-6 overflow-hidden bg-base-100">
      {/* 1. Background Ambient Glows (Consistent with Home/Login) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* 2. Register Card */}
      <div className="relative w-full max-w-[500px] z-10">
        <div className="p-8 md:p-10 rounded-[2.5rem] bg-base-100/40 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-3xl font-black tracking-tight">
              Create Account
            </h1>
            <p className="text-base-content/60 text-sm">
              Join the next generation social community
            </p>
          </div>

          {/* Social Sign Up */}
          {/* <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="btn btn-outline border-base-300 hover:bg-base-200 gap-2 rounded-2xl h-12">
              <Chrome size={18} /> Google
            </button>
            <button className="btn btn-outline border-base-300 hover:bg-base-200 gap-2 rounded-2xl h-12">
              <Github size={18} /> GitHub
            </button>
          </div> */}

          <div className="divider text-[10px] opacity-40 uppercase tracking-[0.2em] mb-8 font-bold">
            Registration details
          </div>
          {/* --- Glassmorphic Error Box --- */}
          {apiError && (
            <div className="relative mb-6 group animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Red Ambient Glow behind the box */}
              <div className="absolute inset-0 bg-error/20 blur-xl rounded-2xl -z-10 group-hover:bg-error/30 transition-colors"></div>

              <div className="relative p-4 rounded-2xl bg-error/10 backdrop-blur-md border border-error/20 flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-error/20 flex items-center justify-center text-error">
                  <X size={20} strokeWidth={3} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-black uppercase tracking-widest text-error opacity-70">
                    Error Details
                  </h3>
                  <p className="text-sm font-bold text-base-content tracking-tight">
                    {apiError}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setApiError(null)}
                  className="btn btn-ghost btn-xs btn-circle opacity-50 hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-200 flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-base-content/20" />
                  )}
                </div>

                {/* Custom Styled Upload Button */}
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera size={16} />
                </label>

                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(null)}
                    className="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full shadow-md"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest mt-3 opacity-40 text-center">
                Upload Profile Picture
              </p>
            </div>
            {/* Username Field */}
            <div className="form-control w-full">
              <label className="label text-xs font-bold uppercase tracking-wider opacity-60">
                Username
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="sakib99"
                  className={`input input-bordered w-full pl-12 rounded-2xl bg-base-100/50 focus:border-primary transition-all ${errors.username ? "border-error" : "border-base-300"}`}
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
              </div>
              {errors.username && (
                <span className="text-error text-[10px] mt-1 ml-1 font-bold">
                  {errors.username.message}
                </span>
              )}
            </div>
            {/* Full Name Field */}
            <div className="form-control w-full">
              <label className="label text-xs font-bold uppercase tracking-wider opacity-60">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Sakib Rahman"
                  className={`input input-bordered w-full pl-12 rounded-2xl bg-base-100/50 focus:border-primary transition-all ${errors.name ? "border-error" : "border-base-300"}`}
                  {...register("name", { required: "Full name is required" })}
                />
              </div>
              {errors.name && (
                <span className="text-error text-[10px] mt-1 ml-1 font-bold">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control w-full">
              <label className="label text-xs font-bold uppercase tracking-wider opacity-60">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`input input-bordered w-full pl-12 rounded-2xl bg-base-100/50 focus:border-primary transition-all ${errors.email ? "border-error" : "border-base-300"}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <span className="text-error text-[10px] mt-1 ml-1 font-bold">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="form-control w-full">
                <label className="label text-xs font-bold uppercase tracking-wider opacity-60">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-10 pr-10 rounded-2xl bg-base-100/50 focus:border-primary transition-all text-sm ${errors.password ? "border-error" : "border-base-300"}`}
                    {...register("password", {
                      required: "Required",
                      minLength: { value: 6, message: "6+ chars" },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-control w-full">
                <label className="label text-xs font-bold uppercase tracking-wider opacity-60">
                  Confirm
                </label>
                <div className="relative group">
                  <ShieldCheck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-10 pr-10 rounded-2xl bg-base-100/50 focus:border-primary transition-all text-sm ${errors.confirmPassword ? "border-error" : "border-base-300"}`}
                    {...register("confirmPassword", {
                      required: "Required",
                      validate: (value) => value === password || "Match fail",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40"
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            {(errors.password || errors.confirmPassword) && (
              <span className="text-error text-[10px] font-bold ml-1">
                {errors.password?.message || errors.confirmPassword?.message}
              </span>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full h-14 rounded-2xl text-lg mt-6 shadow-xl shadow-primary/20 group"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  Create Account
                  <UserPlus
                    className="ml-2 group-hover:scale-110 transition-transform"
                    size={20}
                  />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-base-content/60">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline tracking-tight"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
