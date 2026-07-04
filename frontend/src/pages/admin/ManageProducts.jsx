import { useState, useEffect } from "react";
import { productApi } from "../../api/productApi";
import Navbar from "../../components/Navbar";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
      });
    }
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        await productApi.updateProduct(editingProduct._id, productData);
        setSuccess("Product updated successfully!");
      } else {
        await productApi.addProduct(productData);
        setSuccess("Product added successfully!");
      }

      closeModal();
      loadProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.deleteProduct(productId);
        setSuccess("Product deleted successfully!");
        loadProducts();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Failed to delete product");
      }
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

  return (
    <div className="min-h-screen bg-slate-50 bg-mesh">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Manage <span className="text-gradient">Products</span>
            </h1>
            <p className="mt-1 text-slate-500">
              {products.length} product{products.length !== 1 ? "s" : ""} in
              your catalog.
            </p>
          </div>
          <button onClick={() => openModal()} className="btn-primary">
            <span className="text-lg leading-none">+</span> Add New Product
          </button>
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

        {/* Products Table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-slate-400"
                    >
                      No products found. Add your first product!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg">
                            📦
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {product.name}
                            </div>
                            <div className="max-w-xs truncate text-sm text-slate-500">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        ₹{product.price}
                      </td>
                      <td className="px-6 py-4 text-sm">
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
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal(product)}
                            className="rounded-lg px-3 py-1.5 font-semibold text-brand-600 transition hover:bg-brand-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="rounded-lg px-3 py-1.5 font-semibold text-rose-600 transition hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="relative mt-20 w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-[0_30px_80px_-20px_rgba(16,24,40,0.4)] ring-1 ring-slate-100">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field w-full"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="input-field w-full"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Stock Qty
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="input-field w-full"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button type="submit" className="btn-primary flex-1">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
