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
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
          <div className="text-slate-500">Loading products...</div>
        </div>
      </div>
    );
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-slate-50 bg-mesh">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Discover <span className="text-gradient">Products</span>
          </h1>
          <p className="mt-1 text-slate-500">
            Browse the catalog and build your order.
          </p>
        </div>

        {/* Alerts */}
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Products Section */}
          <div className="lg:col-span-2">
            {products.length === 0 ? (
              <div className="card text-center text-slate-500">
                No products available
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="card card-hover group flex flex-col animate-fade-in-up"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-slate-900">
                        {product.name}
                      </h3>
                      <span className="whitespace-nowrap text-2xl font-extrabold text-gradient">
                        ₹{product.price}
                      </span>
                    </div>

                    <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-500">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.stock > 10
                            ? "bg-emerald-50 text-emerald-700"
                            : product.stock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            product.stock > 10
                              ? "bg-emerald-500"
                              : product.stock > 0
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={
                          product.stock === 0
                            ? "cursor-not-allowed rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-400"
                            : "btn-primary text-sm"
                        }
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
            <div className="sticky top-24">
              <div className="card">
                <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <span>🛒</span> Your Cart
                  </h2>
                  {cartCount > 0 && (
                    <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                      {cartCount} item{cartCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="mb-2 text-4xl">🛍️</div>
                    <p className="text-sm text-slate-400">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                        >
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-slate-800">
                              {item.name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              ₹{item.price} each
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                updateCartQty(item.productId, item.qty - 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQty(item.productId, item.qty + 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="font-semibold text-slate-600">
                          Total
                        </span>
                        <span className="text-2xl font-extrabold text-gradient">
                          ₹{getTotalPrice()}
                        </span>
                      </div>

                      <button
                        onClick={placeOrder}
                        className="btn-primary w-full py-3"
                      >
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
    </div>
  );
};

export default Dashboard;
