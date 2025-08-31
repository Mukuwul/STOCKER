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
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-xl">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray-600">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>
                        <span className="font-medium">Customer:</span>{" "}
                        {order.user?.name || "Unknown"}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {order.user?.email || "Unknown"}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Items Ordered:
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="space-y-2">
                      {order.products.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.product?.name || "Product"} × {item.qty}
                          </span>
                          <span>
                            ₹{(item.product?.price * item.qty || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {order.status === "Pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateOrderStatus(order._id, "Approved")}
                        className="btn-primary text-sm"
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
                    <div className="text-sm text-gray-500">
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
