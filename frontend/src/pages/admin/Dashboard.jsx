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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="text-blue-500 text-3xl">📦</div>
            </div>
          </div>

          <div className="card bg-green-50 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="text-green-500 text-3xl">🛒</div>
            </div>
          </div>

          <div className="card bg-yellow-50 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">
                  Pending Orders
                </p>
                <p className="text-3xl font-bold text-yellow-900">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="text-yellow-500 text-3xl">⏳</div>
            </div>
          </div>

          <div className="card bg-purple-50 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  ₹{stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="text-purple-500 text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => (window.location.href = "/admin/products")}
                className="btn-primary text-center py-4"
              >
                <div className="text-2xl mb-2">📦</div>
                Manage Products
              </button>
              <button
                onClick={() => (window.location.href = "/admin/orders")}
                className="btn-secondary text-center py-4"
              >
                <div className="text-2xl mb-2">🛒</div>
                Manage Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
