import { useState, useEffect } from "react";
import { orderApi } from "../../api/orderApi";
import Navbar from "../../components/Navbar";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
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
            My <span className="text-gradient">Orders</span>
          </h1>
          <p className="mt-1 text-slate-500">Track the status of your orders.</p>
        </div>

        {error && (
          <div className="alert-error mb-6 animate-fade-in">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="card py-12 text-center">
            <div className="mb-2 text-4xl">🧾</div>
            <p className="text-slate-400">
              You haven't placed any orders yet.
            </p>
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
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
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
                    Items
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
                            ₹{(item.product?.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-semibold text-slate-600">
                    Total Amount
                  </span>
                  <span className="text-xl font-extrabold text-gradient">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
