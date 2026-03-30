import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Zap } from "lucide-react";
import { searchPeople } from "../../../services/userService";
import { useNavigate } from "react-router"; 
import { useSelector } from "react-redux";

const SearchModal = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const data = await searchPeople(query);
          setResults(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 400); 

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleUserClick = (id) => {
    if (id === (currentUser?.id || currentUser?._id)) {
      navigate("/social/profile");
    } else {
      navigate(`/social/user/${id}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-10"
    >
      {/* Search Container */}
      <div className="bg-base-100/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        {/* Input Area */}
        <div className="relative p-6 border-b border-white/5">
          <Search className="absolute left-10 top-1/2 -translate-y-1/2 opacity-20" size={22} />
          <input
            autoFocus
            type="text"
            placeholder="Search for people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-12 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:opacity-20"
          />
          {loading && (
            <span className="loading loading-spinner loading-md absolute right-10 top-1/2 -translate-y-1/2 text-primary"></span>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 no-scrollbar">
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((user) => (
                <motion.div
                  key={user._id}
                  whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
                  onClick={() => handleUserClick(user._id)}
                  className="flex items-center justify-between p-5 rounded-[1.8rem] cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-5">
                    <img 
                      src={user.profilePicture} 
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/10 group-hover:ring-primary transition-all" 
                      alt="" 
                    />
                    <div>
                      <h4 className="font-black text-base">{user.name}</h4>
                      <p className="text-xs font-bold opacity-40 uppercase tracking-widest">@{user.username}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-5 group-hover:translate-x-0 transition-all" />
                </motion.div>
              ))}
            </div>
          ) : query.length > 1 && !loading ? (
            <div className="text-center py-20 opacity-20">
              <Zap size={48} className="mx-auto mb-4" />
              <p className="text-sm font-black uppercase tracking-[0.2em]">User not found</p>
            </div>
          ) : (
            <div className="text-center py-20 opacity-10">
              <p className="text-xs font-black uppercase tracking-[0.5em]">Global Search Active</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchModal;