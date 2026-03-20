import React from "react";
import { Zap, MessageSquare, Shield, Globe, Cpu, Layers, Sparkles, Share2 } from "lucide-react";

const Features = () => {
  const featureList = [
    {
      icon: <Zap className="text-primary" size={28} />,
      title: "Instant Feed Updates",
      description: "Powered by Redis Pub/Sub. Experience your feed updating in real-time without ever hitting the refresh button.",
      tag: "Real-time"
    },
    {
      icon: <MessageSquare className="text-secondary" size={28} />,
      title: "Seamless Messaging",
      description: "Ultra-low latency chat infrastructure using Socket.io. Connect with your friends instantly across the globe.",
      tag: "Socket.io"
    },
    {
      icon: <Shield className="text-emerald-500" size={28} />,
      title: "Privacy Encrypted",
      description: "End-to-end data protection. We ensure your personal information and private chats stay strictly yours.",
      tag: "Secure"
    },
    {
      icon: <Cpu className="text-primary" size={28} />,
      title: "Smart Discovery",
      description: "Our algorithm learns your interests to surface the most relevant conversations and communities for you.",
      tag: "AI Powered"
    },
    {
      icon: <Layers className="text-secondary" size={28} />,
      title: "Evergreen UI",
      description: "A meticulously crafted interface with glassmorphism and ambient themes that are easy on the eyes.",
      tag: "Design"
    },
    {
      icon: <Globe className="text-emerald-500" size={28} />,
      title: "Global Scalability",
      description: "Built on a modular MERN architecture, ready to handle millions of concurrent users with ease.",
      tag: "Scalable"
    }
  ];

  return (
    <div className="relative min-h-screen bg-base-100 pt-24 pb-20 overflow-hidden">
      
      {/* 1. Ambient Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[160px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* 2. Header Section */}
        <div className="max-w-3xl mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            Built for the future
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Powerful features for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-500 to-secondary">
              Modern Socializing
            </span>
          </h1>
          <p className="text-lg text-base-content/60 leading-relaxed">
            Everything you need to stay connected, organized, and secure. 
            Powered by industry-leading real-time technologies.
          </p>
        </div>

        {/* 3. Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((f, i) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-3xl bg-base-100/40 backdrop-blur-xl border border-base-300 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              {/* Subtle Icon Background */}
              <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {f.icon}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{f.title}</h3>
                  <span className="text-[10px] font-black uppercase px-2 py-1 bg-base-200 rounded-md opacity-60">
                    {f.tag}
                  </span>
                </div>
                <p className="text-base-content/60 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4. "Under the Hood" Section (Professional Credibility) */}
        <div className="mt-32 p-12 rounded-[40px] bg-base-200/50 border border-base-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                <Share2 size={120} />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">The Technology Stack</h2>
                    <p className="text-base-content/70">
                        FriendsFeed is built using the most robust and scalable technologies in the industry. 
                        Our backend uses <strong>Node.js</strong> and <strong>Express</strong>, while 
                        <strong> Redis</strong> handles our high-speed notification layering.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {["MongoDB", "Express", "React", "Node.js", "Redis", "Socket.io"].map(tech => (
                            <span key={tech} className="px-4 py-1.5 rounded-full bg-base-100 border border-base-300 text-xs font-semibold">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-base-100/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="h-2 w-1/2 bg-primary/20 rounded-full"></div>
                    <div className="h-2 w-full bg-base-300 rounded-full"></div>
                    <div className="h-2 w-3/4 bg-base-300 rounded-full"></div>
                    <div className="pt-4 flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-xs opacity-50 uppercase font-bold">System Status</p>
                            <p className="text-sm font-bold text-success">All Systems Operational</p>
                        </div>
                        <div className="text-2xl font-black text-primary animate-pulse">99.9%</div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Features;