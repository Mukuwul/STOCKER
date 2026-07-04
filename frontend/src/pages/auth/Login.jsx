import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = await authApi.login(formData.email, formData.password);
      login(userData); //stores the token in local storage
      //doubt ye h ki props ki trh q nhi gya ans- kyuki ye component nahi haii

      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 bg-mesh px-4 py-10">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />

      <div className="grid w-full max-w-4xl animate-scale-in overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(16,24,40,0.35)] md:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600 p-10 text-white md:flex">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_35%)]" />
          <div className="relative flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 7v10l9 4 9-4V7" />
                <path d="M12 11v10" />
              </svg>
            </span>
            <span className="text-2xl font-extrabold tracking-tight">STOCKER</span>
          </div>
          <div className="relative">
            <h1 className="text-3xl font-extrabold leading-tight">
              Manage your inventory with confidence.
            </h1>
            <p className="mt-4 max-w-sm text-white/80">
              Track stock, process orders, and stay in control — all from one
              beautifully simple dashboard.
            </p>
          </div>
          <div className="relative flex items-center gap-6 text-sm text-white/70">
            <span> Real-time stock</span>
            <span> Fast orders</span>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="mt-1 text-slate-500">Sign in to continue to STOCKER</p>
          </div>

          {error && (
            <div className="alert-error mb-5 animate-fade-in">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
