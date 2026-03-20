import { Outlet, Link } from "react-router";
import Navbar from "../components/shared/Navbar/Navbar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-base-100 font-sans">
      <Navbar/>
      
      <main className="pt-20">
        <Outlet />  
      </main>
    </div>
  );
};

export default PublicLayout;