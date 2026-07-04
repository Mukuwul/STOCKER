import { useState, useEffect } from "react";
import { orderApi } from "../../api/orderApi";
import Navbar from "../../components/Navbar";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      setSuccess(
        `Order ${newStatus.toLowerCase()} successfully! Customer will be notified.`
      );
      loadOrders();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
      case "Approved":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      case "Declined":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
      default:
        return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
          <div className="text-slate-500">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 bg-mesh">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Manage <span className="text-gradient">Orders</span>
          </h1>
          <p className="mt-1 text-slate-500">
            Review and process customer orders.
          </p>
        </div>

        {error && (
          <div className="alert-error mb-6 animate-fade-in">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="alert-success mb-6 animate-fade-in">
            <span>✅</span>
            {success}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="card py-12 text-center">
            <div className="mb-2 text-4xl">📭</div>
            <p className="text-slate-400">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="card card-hover animate-fade-in-up"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Order{" "}
                      <span className="text-gradient">
                        #{order._id.slice(-8)}
                      </span>
                    </h3>
                    <div className="mt-2 space-y-0.5 text-sm text-slate-500">
                      <p>
                        <span className="font-semibold text-slate-600">
                          Customer:
                        </span>{" "}
                        {order.user?.name || "Unknown"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-600">
                          Email:
                        </span>{" "}
                        {order.user?.email || "Unknown"}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-600">
                          Date:
                        </span>{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-bold text-slate-700">
                    Items Ordered
                  </h4>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="space-y-2">
                      {order.products.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-slate-600">
                            {item.product?.name || "Product"} × {item.qty}
                          </span>
                          <span className="font-semibold text-slate-800">
                            ₹{(item.product?.price * item.qty || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-slate-600">Total:</span>
                    <span className="text-xl font-extrabold text-gradient">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {order.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOrderStatus(order._id, "Approved")}
                        className="btn-success text-sm"
                      >
                        Approve Order
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id, "Declined")}
                        className="btn-danger text-sm"
                      >
                        Decline Order
                      </button>
                    </div>
                  )}

                  {order.status !== "Pending" && (
                    <div className="text-sm font-medium text-slate-400">
                      Order {order.status.toLowerCase()} ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
