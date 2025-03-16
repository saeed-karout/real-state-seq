import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  return (
    <div className="min-h-screen max-w-[1366px] mx-auto px-4 sm:px-6 md:px-8 lg:max-w-7xl md:max-w-4xl sm:max-w-xl flex flex-col">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content flex-1 min-h-[calc(100vh-100px)] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  else {
    return (
      <div className="min-h-screen max-w-[1366px] mx-auto px-4 sm:px-6 md:px-8 lg:max-w-7xl md:max-w-4xl sm:max-w-xl flex flex-col">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content flex-1 min-h-[calc(100vh-100px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    );
  }
}

export { Layout, RequireAuth };