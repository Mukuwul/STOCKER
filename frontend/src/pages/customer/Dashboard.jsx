import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { productApi } from "../../api/productApi";
import { orderApi } from "../../api/orderApi";
import Navbar from "../../components/Navbar";

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.productId === product._id);

    if (existingItem) {
      if (existingItem.qty >= product.stock) {
        setError("Not enough stock available");
        return;
      }
      setCart(
        cart.map((item) =>
          item.productId === product._id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          qty: 1,
          stock: product.stock,
        },
      ]);
    }
    setError("");
    setSuccess(`${product.name} added to cart!`);
    setTimeout(() => setSuccess(""), 2000);
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty === 0) {
      setCart(cart.filter((item) => item.productId !== productId));
      return;
    }

    const product = products.find((p) => p._id === productId);
    if (newQty > product.stock) {
      setError("Not enough stock available");
      return;
    }

    setCart(
      cart.map((item) =>
        item.productId === productId ? { ...item, qty: newQty } : item
      )
    );
    setError("");
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.qty, 0)
      .toFixed(2);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    try {
      const orderProducts = cart.map((item) => ({
        productId: item.productId,
        qty: item.qty,
      }));

      await orderApi.placeOrder(orderProducts);
      setCart([]);
      setSuccess(
        "Order placed successfully! Check your email for confirmation."
      );
      loadProducts(); // Refresh products to show updated stock
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-xl">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Alerts */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>

            {products.length === 0 ? (
              <div className="card text-center">
                <p className="text-gray-600">No products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{product.price}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{product.description}</p>

                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${
                          product.stock > 10
                            ? "text-green-600"
                            : product.stock > 0
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`${
                          product.stock === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "btn-primary"
                        } text-sm`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Shopping Cart
            </h2>

            <div className="card">
              {cart.length === 0 ? (
                <p className="text-gray-600 text-center">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            ₹{item.price} each
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateCartQty(item.productId, item.qty - 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.qty}</span>
                          <button
                            onClick={() =>
                              updateCartQty(item.productId, item.qty + 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{getTotalPrice()}
                      </span>
                    </div>

                    <button onClick={placeOrder} className="btn-primary w-full">
                      Place Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
