import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Mail, Lock, Eye, EyeOff, LogIn, X } from "lucide-react";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";
import { setCredentials, setLoading } from "./authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);  

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // --- Login Logic ---
  const onSubmit = async (data) => {
    setApiError(null);
    const toastId = toast.loading("Verifying credentials...");
    console.log(data)
    try {
      dispatch(setLoading(true));
      
      const result = await loginUser(data);
      
      dispatch(setCredentials(result));
      
      toast.success("Welcome back!", { id: toastId });
      navigate("/social");  
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid email or password";
      setApiError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-6 overflow-hidden bg-base-100">
      
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="relative w-full max-w-[450px] z-10">
        <div className="p-8 md:p-10 rounded-[2.5rem] bg-base-100/40 backdrop-blur-2xl border border-white/10 shadow-2xl">
          
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-base-content">Welcome Back</h1>
            <p className="text-base-content/60 text-sm">
              Enter your credentials to access your feed
            </p>
          </div>

          {/* --- Glassmorphic Error Box --- */}
          {apiError && (
            <div className="relative mb-6 group animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="absolute inset-0 bg-error/20 blur-xl rounded-2xl -z-10"></div>
              <div className="relative p-4 rounded-2xl bg-error/10 backdrop-blur-md border border-error/20 flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-error/20 flex items-center justify-center text-error">
                  <X size={20} strokeWidth={3} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-black uppercase tracking-widest text-error opacity-70">Login Failed</h3>
                  <p className="text-sm font-bold text-base-content tracking-tight">{apiError}</p>
                </div>
                <button type="button" onClick={() => setApiError(null)} className="opacity-50 hover:opacity-100 transition-opacity">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Field */}
            <div className="form-control w-full">
              <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`input input-bordered w-full pl-12 rounded-2xl bg-base-100/50 focus:border-primary transition-all ${errors.email ? 'border-error' : 'border-base-300'}`}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                  })}
                />
              </div>
              {errors.email && <span className="text-error text-xs mt-1 ml-1">{errors.email.message}</span>}
            </div>

            {/* Password Field */}
            <div className="form-control w-full">
              <div className="flex justify-between items-end mb-1">
                <label className="label p-0 text-xs font-bold uppercase tracking-wider opacity-60">Password</label>
                <Link to="/forgot-password" size="xs" className="text-xs text-primary hover:underline font-semibold">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-12 pr-12 rounded-2xl bg-base-100/50 focus:border-primary transition-all ${errors.password ? 'border-error' : 'border-base-300'}`}
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" }
                  })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-error text-xs mt-1 ml-1">{errors.password.message}</span>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary w-full h-14 rounded-2xl text-lg mt-4 shadow-xl shadow-primary/20 group"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  Sign In
                  <LogIn className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-base-content/60">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline tracking-tight">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
 