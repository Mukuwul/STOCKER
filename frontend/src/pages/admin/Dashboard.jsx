import { useState, useEffect } from "react";
import { productApi } from "../../api/productApi";
import { orderApi } from "../../api/orderApi";
import Navbar from "../../components/Navbar";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    declinedOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData] = await Promise.all([
        productApi.getProducts(),
        orderApi.getAllOrders(),
      ]);

      const pendingOrders = ordersData.filter(
        (order) => order.status === "Pending"
      ).length;
      const approvedOrders = ordersData.filter(
        (order) => order.status === "Approved"
      ).length;
      const declinedOrders = ordersData.filter(
        (order) => order.status === "Declined"
      ).length;
      const totalRevenue = ordersData
        .filter((order) => order.status === "Approved")
        .reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        pendingOrders,
        approvedOrders,
        declinedOrders,
        totalRevenue,
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
          <div className="text-slate-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      gradient: "from-brand-500 to-violet-600",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: "🛒",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: "💰",
      gradient: "from-fuchsia-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 bg-mesh">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Admin <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="mt-1 text-slate-500">
            An overview of your store's performance.
          </p>
        </div>

        {error && (
          <div className="alert-error mb-6 animate-fade-in">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="card card-hover relative overflow-hidden animate-fade-in-up"
            >
              <div
                className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${s.gradient} opacity-10`}
              />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {s.label}
                  </p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">
                    {s.value}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-2xl shadow-glow`}
                >
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Order Status Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width:
                          stats.totalOrders > 0
                            ? `${
                                (stats.pendingOrders / stats.totalOrders) * 100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.pendingOrders}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width:
                          stats.totalOrders > 0
                            ? `${
                                (stats.approvedOrders / stats.totalOrders) * 100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.approvedOrders}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Declined</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width:
                          stats.totalOrders > 0
                            ? `${
                                (stats.declinedOrders / stats.totalOrders) * 100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.declinedOrders}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card lg:col-span-2">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={() => (window.location.href = "/admin/products")}
                className="group flex flex-col items-start gap-3 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 p-6 text-left text-white shadow-glow transition-all duration-200 hover:-translate-y-1 hover:brightness-110"
              >
                <span className="text-3xl">📦</span>
                <div>
                  <p className="text-lg font-bold">Manage Products</p>
                  <p className="text-sm text-white/80">
                    Add, edit or remove items
                  </p>
                </div>
              </button>
              <button
                onClick={() => (window.location.href = "/admin/orders")}
                className="group flex flex-col items-start gap-3 rounded-2xl bg-white p-6 text-left ring-1 ring-slate-200 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:ring-brand-200"
              >
                <span className="text-3xl">🛒</span>
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    Manage Orders
                  </p>
                  <p className="text-sm text-slate-500">
                    Approve or decline orders
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
