import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardRoute = () => {
    return user?.role === "admin" ? "/admin/dashboard" : "/customer/dashboard";
  };

  const isActive = (path) => location.pathname === path;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium transition-colors ${
        isActive(to)
          ? "text-brand-600"
          : "text-slate-600 hover:text-brand-600"
      }`}
    >
      {label}
      {isActive(to) && (
        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-violet-600" />
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to={getDashboardRoute()}
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 7v10l9 4 9-4V7" />
                <path d="M12 11v10" />
              </svg>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              STOCK<span className="text-gradient">ER</span>
            </span>
          </Link>

          {/* Customer Navigation (desktop) */}
          {user?.role === "customer" && (
            <div className="hidden items-center gap-1 md:flex">
              {navLink("/customer/dashboard", "Products")}
              {navLink("/customer/orders", "My Orders")}
            </div>
          )}

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            {/* Mobile menu for customers */}
            {user?.role === "customer" && (
              <div className="relative md:hidden">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Menu ▾
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-card">
                    <Link
                      to="/customer/dashboard"
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      Products
                    </Link>
                    <Link
                      to="/customer/orders"
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Orders
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name}
                </p>
                <p className="text-xs font-medium capitalize text-brand-600">
                  {user?.role}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-sm font-bold text-white shadow-glow ring-2 ring-white">
                {initials}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
