import {Link} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore.js";
import {LogOut, MessageSquare, Settings, User} from "lucide-react";


const NavBar = () => {
  const {authUser, logout} = useAuthStore();
  
  return (
    <header className="bg-white border-b shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo & Title */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <MessageSquare className="w-6 h-6 text-gray-700" />
            <h1 className="text-lg font-semibold text-gray-900">ChatApp</h1>
          </Link>
        </div>

        {/* Right Side: Navigation */}
        <div className="flex items-center gap-4">
          {/* Profile & Logout (Only if Authenticated) */}
          {authUser && (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-100 transition"
                onClick={logout}
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
};

export default NavBar;