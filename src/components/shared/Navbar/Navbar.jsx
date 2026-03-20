import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";  
import { useSelector, useDispatch } from "react-redux";
import { Bell, Menu, X, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { clsx } from "clsx";

import { logout } from "../../../features/auth/authSlice.js"; 
import Logo from "../../../assets/logo.png";
import ThemeController from "../ThemeController/ThemeController";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux থেকে Auth স্টেট নেওয়া
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
  ];

  return (
    <nav
      className={clsx(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-base-100/70 backdrop-blur-xl border-base-300 py-2 shadow-sm" 
          : "bg-transparent border-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12">
          
          {/* 1. Logo Section (Left) */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden bg-base-100 p-2 border-primary/20 border">
                <img src={Logo} alt="FriendsFeed" className="w-full h-full object-contain" />
              </div>
              <span className="hidden sm:inline text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                FriendsFeed
              </span>
            </Link>
          </div>

          {/* 2. Navigation Links (Center) */}
          <div className="hidden md:flex flex-none items-center justify-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-primary relative py-1",
                  location.pathname === link.path ? "text-primary font-bold" : "text-base-content/70"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* 3. Action Buttons Section (Right) */}
          <div className="flex-1 flex items-center justify-end gap-3">
            
            {/* Always Visible: Theme Controller */}
            <ThemeController />

            {isAuthenticated ? (
              /* --- Logged In View --- */
              <div className="hidden md:flex items-center gap-3">
                <button className="btn btn-ghost btn-circle btn-sm relative">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-ping"></span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full"></span>
                </button>

                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img 
                        src={user?.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                        alt="profile" 
                      />
                    </div>
                  </div>
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
                    <li className="px-4 py-2 font-bold text-primary truncate">Hi, {user?.name.split(' ')[0]}</li>
                    <div className="divider my-0"></div>
                    <li><Link to="/social"><LayoutDashboard size={16}/> My Feed</Link></li>
                    <li><Link to="/social/profile"><User size={16}/> Profile</Link></li>
                    <li><a><Settings size={16}/> Settings</a></li>
                    <hr className="my-1 border-base-300" />
                    <li><button onClick={handleLogout} className="text-error font-bold"><LogOut size={16}/> Logout</button></li>
                  </ul>
                </div>
              </div>
            ) : (
              /* --- Logged Out View --- */
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm px-4">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm px-6 shadow-md rounded-xl">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="btn btn-ghost btn-sm"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer */}
      <div className={clsx(
        "md:hidden absolute top-full left-0 w-full bg-base-100/95 backdrop-blur-xl border-b border-base-300 transition-all duration-300 overflow-hidden",
        isMobileMenuOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0"
      )}>
        <div className="px-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-semibold hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="divider opacity-10"></div>
          {isAuthenticated ? (
             <div className="space-y-4">
                <Link to="/social" className="btn btn-outline w-full" onClick={() => setIsMobileMenuOpen(false)}>My Feed</Link>
                <button onClick={handleLogout} className="btn btn-error btn-outline w-full">Logout</button>
             </div>
          ) : (
             <div className="space-y-4">
                <Link to="/login" className="btn btn-ghost w-full" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary w-full shadow-lg shadow-primary/20" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
             </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;