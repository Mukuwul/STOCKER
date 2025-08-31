import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardRoute = () => {
    return user?.role === "admin" ? "/admin/dashboard" : "/customer/dashboard";
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={getDashboardRoute()}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              STOCKER
            </Link>
          </div>

          {/* Customer Navigation (only show for customers) */}
          {user?.role === "customer" && (
            <div className="hidden md:flex space-x-8">
              <Link
                to="/customer/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Products
              </Link>
              <Link
                to="/customer/orders"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                My Orders
              </Link>
            </div>
          )}

          {/* User info and logout */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* Mobile menu for customers */}
              {user?.role === "customer" && (
                <div className="md:hidden">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2"
                  >
                    Menu ▾
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                      <Link
                        to="/customer/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Products
                      </Link>
                      <Link
                        to="/customer/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Orders
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="text-gray-700">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
            <button onClick={handleLogout} className="btn-danger text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
    
export default Navbar;
