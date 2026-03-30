import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserMinus,
  UserCheck,
  X,
  MessageSquare,
  Zap,
  Clock,
  Send,
  Search,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "../../../services/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const FriendsPage = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming");
  const [loading, setLoading] = useState(true);
  const [unfriendTarget, setUnfriendTarget] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profileRes = await axiosInstance.get("/users/profile");
      setFriends(profileRes.data.user.friends || []);

      const incomingRes = await axiosInstance.get("/users/requests/pending");
      setIncomingRequests(incomingRes.data);

      const outgoingRes = await axiosInstance.get("/users/requests/sent");
      setSentRequests(outgoingRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, status) => {
    try {
      await axiosInstance.put(`/users/request/respond/${requestId}`, {
        status,
      });
      toast.success(
        status === "accepted" ? "Added to circle" : "Request declined",
      );
      fetchData();
    } catch (err) {
      toast.error("Action failed");
    }
  };
  const handleUnfriendClick = (friend) => {
    setUnfriendTarget(friend); // মোডাল ওপেন হবে এবং ডাটা সেট হবে
  };
  const confirmUnfriend = async (friendId) => {
    try {
      await axiosInstance.post(`/users/unfriend/${friendId}`);
      toast.success("Connection removed", {
        icon: "👋",
        style: { borderRadius: "15px", background: "#333", color: "#fff" },
      });
      setUnfriendTarget(null); // মোডাল ক্লোজ হবে
      fetchData(); // লিস্ট রিফ্রেশ হবে
    } catch (err) {
      toast.error("Failed to unfriend");
      console.error(err);
    }
  };
  const handleCancelRequest = async (requestId) => {
    try {
      await axiosInstance.delete(`/users/request/cancel/${requestId}`);
      toast.success("Request withdrawn");
      fetchData();
    } catch (err) {
      toast.error("Failed to cancel");
    }
  };

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen pb-20 bg-base-100 relative overflow-hidden">
      {/* Abstract Background Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 pt-12 relative z-10">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <Users className="text-primary" size={36} /> Circle
            </h1>
            <p className="text-xs font-bold opacity-40 uppercase tracking-[0.3em] mt-2">
              {friends.length} Connections Total
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
              size={18}
            />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-base-200/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* --- Top Section: Friends List --- */}
        <section className="bg-base-200/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-4 mb-10 shadow-xl shadow-black/5">
          <div className="px-4 py-2 mb-2 border-b border-white/5">
            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">
              Active Connections
            </span>
          </div>

          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <motion.div
                  key={friend._id}
                  layout
                  className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-all group"
                >
                  {/* Avatar Container Fixed */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={friend.profilePicture}
                      className="w-12 h-12 rounded-xl object-cover shadow-inner ring-1 ring-white/10"
                      alt=""
                      onClick={() => navigate(`/social/user/${friend._id}`)}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success border-2 border-base-100 rounded-full"></div>
                  </div>

                  {/* Name & Username */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/social/user/${friend._id}`)}
                  >
                    <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                      {friend.name}
                    </h4>
                    <p className="text-[10px] opacity-40 font-black uppercase tracking-tighter truncate">
                      @{friend.username}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <button className="btn btn-ghost btn-sm p-2 hover:bg-primary/10 hover:text-primary rounded-xl">
                      <MessageSquare size={18} />
                    </button>
                    <button
                      onClick={() => handleUnfriendClick(friend)}
                      className="btn btn-ghost btn-sm p-2 hover:bg-error/10 hover:text-error rounded-xl"
                    >
                      <UserMinus size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center opacity-20">
                <Zap size={32} className="mx-auto mb-3" />
                <p className="text-xs font-black uppercase tracking-widest">
                  No friends found
                </p>
              </div>
            )}
          </div>
        </section>

        {/* --- Second Section: Request Management --- */}
        <section className="bg-base-200/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl">
          {/* Tabs UI */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h3 className="text-lg font-black tracking-tight">Management</h3>
            <div className="flex bg-base-300/50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("incoming")}
                className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === "incoming" ? "bg-base-100 text-primary shadow-sm" : "opacity-40"}`}
              >
                RECEIVED{" "}
                {incomingRequests.length > 0 && `(${incomingRequests.length})`}
              </button>
              <button
                onClick={() => setActiveTab("outgoing")}
                className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === "outgoing" ? "bg-base-100 text-secondary shadow-sm" : "opacity-40"}`}
              >
                SENT
              </button>
            </div>
          </div>

          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                {(activeTab === "incoming" ? incomingRequests : sentRequests)
                  .length > 0 ? (
                  (activeTab === "incoming"
                    ? incomingRequests
                    : sentRequests
                  ).map((req) => (
                    <div
                      key={req._id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            (activeTab === "incoming"
                              ? req.sender
                              : req.receiver
                            )?.profilePicture
                          }
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          alt=""
                        />
                        <div>
                          <h5 className="font-bold text-xs">
                            {
                              (activeTab === "incoming"
                                ? req.sender
                                : req.receiver
                              )?.name
                            }
                          </h5>
                          <p className="text-[9px] opacity-40 font-black uppercase tracking-tighter">
                            {activeTab === "incoming"
                              ? "Wants to connect"
                              : "Pending response"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {activeTab === "incoming" ? (
                          <>
                            <button
                              onClick={() =>
                                handleResponse(req._id, "accepted")
                              }
                              className="btn btn-primary btn-xs rounded-lg font-bold px-3"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleResponse(req._id, "rejected")
                              }
                              className="btn btn-ghost btn-xs rounded-lg px-3"
                            >
                              Ignore
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleCancelRequest(req._id)}
                            className="btn btn-ghost btn-xs text-error font-bold hover:bg-error/10 px-3"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center opacity-10">
                    <Clock size={24} className="mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      No activity
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(100, 100, 100, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 100, 100, 0.2);
  }
`,
        }}
      />
      {/* --- Unfriend Confirmation Modal --- */}
      <AnimatePresence>
        {unfriendTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUnfriendTarget(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-base-100 border border-white/10 rounded-[2.5rem] p-8 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
                <UserMinus size={40} />
              </div>

              <h3 className="text-2xl font-black tracking-tight mb-2">
                Break Connection?
              </h3>
              <p className="text-sm opacity-60 font-medium mb-8 leading-relaxed">
                Are you sure you want to remove{" "}
                <span className="text-base-content font-bold">
                  @{unfriendTarget.username}
                </span>{" "}
                from your circle?
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => confirmUnfriend(unfriendTarget._id)}
                  className="btn btn-error btn-md rounded-2xl font-black w-full shadow-lg shadow-error/20"
                >
                  Yes, Unfriend
                </button>
                <button
                  onClick={() => setUnfriendTarget(null)}
                  className="btn btn-ghost btn-md rounded-2xl font-bold w-full"
                >
                  Keep Friend
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FriendsPage;
