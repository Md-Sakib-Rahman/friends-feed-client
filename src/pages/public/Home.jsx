import React from "react";
import { Link } from "react-router";
import { ArrowRight, Sparkles, MessageCircle, Heart, Share2, UserPlus, Star } from "lucide-react";
import { clsx } from "clsx";

const floatingIcons = [
  { Icon: MessageCircle, pos: "top-1/4 left-10 md:left-24", anim: "animate-float-fast" },
  { Icon: Heart, pos: "top-1/3 right-10 md:right-32", anim: "animate-float-slow" },
  { Icon: Share2, pos: "bottom-1/3 left-1/4", anim: "animate-float-medium" },
  { Icon: UserPlus, pos: "top-10 right-24 -translate-x-1/2", anim: "animate-float-slow" },
  { Icon: Star, pos: "bottom-1/4 right-1/4", anim: "animate-float-fast" },
  { Icon: MessageCircle, pos: "bottom-1/2 left-5", anim: "animate-float-medium" },
];

const Home = () => {
  return (
    <div className="relative min-h-[calc(100vh-200px)] flex items-center justify-center overflow-hidden bg-base-100">
      
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse z-0"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse z-0" style={{ animationDelay: '2s' }}></div>

    
      <div className="absolute inset-0 z-10 pointer-events-none">
        {floatingIcons.map((item, index) => {
          const { Icon, pos, anim } = item;
          return (
            <div key={index} className={clsx("absolute text-primary/30", pos, anim)}>
              <div className="relative group">
                <Icon size={40} className="absolute inset-0 text-primary/5 blur-[2px] -translate-y-2 translate-x-1" />
                <Icon size={40} className="absolute inset-0 text-primary/10 blur-[1px]" />
                <Icon size={40} className="relative text-primary/20" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">  
        <div className="flex flex-col items-center text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-bounce-slow">
            <Sparkles size={16} />
            <span>The next generation social experience</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight">
            Connect with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-500 to-secondary">
              Purpose & Passion
            </span>
          </h1>

          <div className="max-w-2xl p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-sm">
             <p className="text-lg md:text-xl text-base-content/70 leading-relaxed px-6 py-4">
               FriendsFeed is where meaningful conversations happen. Join a community built 
               on transparency, privacy, and real-time interactions.
             </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link 
              to="/register" 
              className="btn btn-primary btn-lg px-10 h-16 rounded-2xl text-lg shadow-2xl shadow-primary/20 group w-full sm:w-auto"
            >
              Get Started for Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/login" 
              className="btn btn-outline border-base-300 hover:border-primary btn-lg px-10 h-16 rounded-2xl text-lg backdrop-blur-md w-full sm:w-auto"
            >
              Sign In to Feed
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 opacity-60">
            <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold">10k+</span>
                <span className="text-xs uppercase tracking-widest">Active Users</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold">50k+</span>
                <span className="text-xs uppercase tracking-widest">Daily Posts</span>
            </div>
            <div className="hidden md:flex flex-col items-center gap-1">
                <span className="text-2xl font-bold">99.9%</span>
                <span className="text-xs uppercase tracking-widest">Uptime</span>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-base-100 to-transparent z-30"></div>
    </div>
  );
};

export default Home;
