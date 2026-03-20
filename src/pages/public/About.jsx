import React from "react";
import { Link } from "react-router";
import { ShieldCheck, Zap, Users, Heart, Globe, MessageSquare } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <ShieldCheck className="text-primary" size={32} />,
      title: "Privacy First",
      desc: "Your data belongs to you. We use industry-standard encryption to keep your conversations private.",
    },
    {
      icon: <Zap className="text-secondary" size={32} />,
      title: "Real-time Interaction",
      desc: "Experience zero-lag communication powered by our advanced Socket.io and Redis infrastructure.",
    },
    {
      icon: <Users className="text-emerald-500" size={32} />,
      title: "Community Driven",
      desc: "Built for developers and creators to connect, share, and grow together in a healthy environment.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-base-100 overflow-hidden pt-20">
      
      {/* 1. Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* 2. Hero Section */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Redefining Social <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Connectivity
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-base-content/70 leading-relaxed">
            FriendsFeed started with a simple idea: Create a social platform that is fast, 
            secure, and focuses on what truly matters—real human connection without the noise.
          </p>
        </div>

        {/* 3. The "Vision" Glass Card */}
        <div className="relative p-1 group mb-24">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-base-100/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-3xl flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">Our Vision</h2>
              <p className="text-base-content/80 leading-relaxed text-lg">
                We believe that the future of the web is decentralized and real-time. 
                FriendsFeed leverages the power of the MERN stack and Redis to deliver 
                instant notifications and seamless feed updates, ensuring you never 
                miss a beat from your circle.
              </p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <MessageSquare size={18}/> 1M+ Messages
                 </div>
                 <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                    <Globe size={18}/> Global Reach
                 </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              <div className="h-32 bg-primary/20 rounded-2xl animate-pulse"></div>
              <div className="h-32 bg-secondary/20 rounded-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="h-32 bg-emerald-500/20 rounded-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="h-32 bg-base-300 rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* 4. Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {values.map((val, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-base-200/50 border border-base-300 hover:border-primary/50 transition-all hover:-translate-y-2">
              <div className="mb-6 bg-base-100 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                {val.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{val.title}</h3>
              <p className="text-base-content/60 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>

        {/* 5. Professional CTA */}
        <div className="text-center space-y-8 py-12 border-t border-base-300">
          <h2 className="text-3xl font-bold">Ready to join the feed?</h2>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn btn-primary px-8 rounded-xl shadow-xl shadow-primary/20">
              Create Free Account
            </Link>
            <Link to="/social" className="btn btn-ghost px-8 rounded-xl border border-base-300">
              Explore Features
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;