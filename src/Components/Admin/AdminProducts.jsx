import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import "./AdminCSS/AdminProducts.css"


// const API_URL = "http://localhost:4000/api/admin " || "https://sks-serverproject-new.onrender.com/api/admin";
const API_URL = "https://sks-serverproject-new.onrender.com/api/admin";


const initialProducts = [
  // {
  //   id: 1,
  //   name: "Mathematics - Grade 10",
  //   category: "Books",
  //   price: 499,
  //   stock: 45,
  //   status: "Active",
  // },
  // {
  //   id: 2,
  //   name: "Science Learning Kit",
  //   category: "Learning Kits",
  //   price: 799,
  //   stock: 5,
  //   status: "Active",
  // },
  // {
  //   id: 3,
  //   name: "English Grammar Guide",
  //   category: "Books",
  //   price: 349,
  //   stock: 28,
  //   status: "Active",
  // },
  // {
  //   id: 4,
  //   name: "Competitive Exam Practice Set",
  //   category: "Study Material",
  //   price: 599,
  //   stock: 0,
  //   status: "Inactive",
  // },
];

// const emptyForm = {
//   name: "",
//   category: "Books",
//   price: "",
//   stock: "",
//   status: "Active",
// };


const emptyForm = {
  name: "",
  category_id: "",
  price: "",
  stock: "",
  status: "Active",
}

export default function AdminProducts() {
  // const [products, setProducts] = useState(initialProducts);
  // const [category, setCategory] = useState("All");
  // const [search, setSearch] = useState("");
  // const [status, setStatus] = useState("All");
  // const [modalOpen, setModalOpen] = useState(false);
  // const [editingId, setEditingId] = useState(null);
  // const [form, setForm] = useState(emptyForm);
  // const [page, setPage] = useState(1);
  // const [deleteId, setDeleteId] = useState(null);

  const [products, setProducts] = useState(initialProducts)
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ebook, setEbook] = useState(null);
  const [docx, setDocx] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const pageSize = 5;

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${API_URL}/products`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/categories`, {
            withCredentials: true,
          }),
        ]);

        if (cancelled) return;

        setProducts(productsResponse.data.products || []);
        setCategories(categoriesResponse.data.categories || []);
      } catch (err) {
        if (cancelled) return;

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          window.location.assign("/admin/login");
          return;
        }

        setError(
          err.response?.data?.message ||
          "Unable to load products and categories."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);


  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        // product.name.toLowerCase().includes(search.toLowerCase()) ||
        // product.category.toLowerCase().includes(search.toLowerCase());
        String(product.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        String(product.category || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        // category === "All" || product.category === category;
        category === "All" ||
        String(product.category_id) === String(category);

      const matchesStatus =
        status === "All" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / pageSize)
  );

  const currentProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const activeCount = products.filter(
    (product) => product.status === "Active"
  ).length;

  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 10
  ).length;

  // const openAddModal = () => {
  //   setEditingId(null);
  //   setForm(emptyForm);
  //   setModalOpen(true);
  // };
  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      category_id: categories[0] ? String(categories[0].id) : "",
    });
    setEbook(null);
    setDocx(null);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      // category: product.category,
      category_id: String(product.category_id || ""),

      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0),
      status: product.status || "Active",
    });
    setEbook(null);
    setDocx(null);
    setError("");
    setModalOpen(true);
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   const name = form.name.trim();
  //   const price = Number(form.price);
  //   const stock = Number(form.stock);

  //   if (
  //     !name ||
  //     form.price === "" ||
  //     form.stock === "" ||
  //     !Number.isFinite(price) ||
  //     !Number.isFinite(stock) ||
  //     price < 0 ||
  //     stock < 0
  //   ) {
  //     return;
  //   }

  //   const productData = {
  //     name,
  //     category: form.category,
  //     price,
  //     stock,
  //     status: form.status,
  //   };

  //   if (editingId !== null) {
  //     setProducts((previous) =>
  //       previous.map((product) =>
  //         product.id === editingId
  //           ? { ...product, ...productData }
  //           : product
  //       )
  //     );
  //   } else {
  //     setProducts((previous) => [
  //       ...previous,
  //       { id: Date.now(), ...productData },
  //     ]);
  //   }

  //   setModalOpen(false);
  //   setForm(emptyForm);
  //   setEditingId(null);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !name ||
      !form.category_id ||
      form.price === "" ||
      form.stock === "" ||
      !Number.isFinite(price) ||
      !Number.isInteger(stock) ||
      price < 0 ||
      stock < 0
    ) {
      setError("Enter valid product details.");
      return;
    }

    // if (editingId === null && !ebook) {
    //   setError("Please upload the product's e-book PDF.");
    //   return;
    // }

    if (editingId === null && (!ebook || !docx)) {
      setError("Please upload both PDF and DOCX files.");
      return;
    }

    const payload = new FormData();

    payload.append("name", name);
    payload.append("category_id", form.category_id);
    payload.append("price", String(price));
    payload.append("stock", String(stock));
    payload.append("status", form.status);

    if (ebook) {
      payload.append("ebook", ebook);
    }

    if (docx) {
      payload.append("docx", docx);
    }

    setSaving(true);
    setError("");

    try {
      if (editingId !== null) {
        await axios.put(
          `${API_URL}/products/${editingId}`,
          payload,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${API_URL}/products`,
          payload,
          { withCredentials: true }
        );
      }

      const response = await axios.get(`${API_URL}/products`, {
        withCredentials: true,
      });

      setProducts(response.data.products || []);
      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setEbook(null);
      setPage(1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // const confirmDelete = () => {
  //   setProducts((previous) =>
  //     previous.filter((product) => product.id !== deleteId)
  //   );
  //   setDeleteId(null);
  //   setPage(1);
  // };

  const confirmDelete = async () => {
    setError("");

    try {
      await axios.delete(`${API_URL}/products/${deleteId}`, {
        withCredentials: true,
      });

      setProducts((previous) =>
        previous.filter((product) => product.id !== deleteId)
      )

      setDeleteId(null);
      setPage(1);
    }
    catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete product."
      )
    }
  }

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  return (
    <div className="sks-products">
      <div className="sks-products-heading">
        <div>
          <h1>Products</h1>
          <p>Manage your product catalogue and inventory.</p>
        </div>

        <button
          type="button"
          className="sks-products-primary"
          onClick={openAddModal}
        >
          <span>＋</span> Add Product
        </button>
      </div>

      {error && (
        <div role="alert">
          {error}
        </div>
      )}

      <div className="sks-products-stats">
        <div className="sks-products-stat">
          <div className="sks-products-stat-icon blue">▤</div>
          <div>
            <p>Total Products</p>
            <h2>{products.length}</h2>
          </div>
        </div>

        <div className="sks-products-stat">
          <div className="sks-products-stat-icon green">✓</div>
          <div>
            <p>Active Products</p>
            <h2>{activeCount}</h2>
          </div>
        </div>

        <div className="sks-products-stat">
          <div className="sks-products-stat-icon orange">!</div>
          <div>
            <p>Low Stock</p>
            <h2>{lowStockCount}</h2>
          </div>
        </div>
      </div>

      <section className="sks-products-panel">
        <div className="sks-products-panel-heading">
          <div>
            <h2>Product Catalogue</h2>
            <p>View and manage all your products.</p>
          </div>
          <span className="sks-products-count">
            {filteredProducts.length} products
          </span>
        </div>

        <div className="sks-products-toolbar">
          <div className="sks-products-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Categories</option>
            {/* <option value="Books">Books</option>
            <option value="Learning Kits">Learning Kits</option>
            <option value="Study Material">Study Material</option> */}
            {categories.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="sks-products-table-wrap">
          <table className="sks-products-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="sks-products-empty">
                    Loading products...
                  </td>
                </tr>
              )}
              {!loading && currentProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="sks-products-name">
                      <div className="sks-products-thumbnail">
                        <span>▤</span>
                      </div>
                      <div>
                        <strong>{product.name}</strong>
                        <small>ID: {product.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="sks-products-category">
                      {product.category}
                    </span>
                  </td>

                  <td className="sks-products-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`sks-products-stock ${product.stock === 0
                        ? "out"
                        : product.stock <= 10
                          ? "low"
                          : ""
                        }`}
                    >
                      {product.stock === 0
                        ? "Out of stock"
                        : product.stock <= 10
                          ? `${product.stock} left`
                          : product.stock}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`sks-products-status ${product.status === "Active" ? "active" : "inactive"
                        }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td>
                    <div className="sks-products-actions">
                      <button
                        type="button"
                        title="Edit product"
                        aria-label={`Edit ${product.name}`}
                        onClick={() => openEditModal(product)}
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        title="Delete product"
                        aria-label={`Delete ${product.name}`}
                        className="delete"
                        onClick={() => setDeleteId(product.id)}
                      >
                        ♲
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && currentProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="sks-products-empty">
                    <div>▤</div>
                    <strong>No products found</strong>
                    <p>Try changing your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sks-products-pagination">
          <p>
            Showing{" "}
            {filteredProducts.length === 0
              ? 0
              : (page - 1) * pageSize + 1}
            {" - "}
            {Math.min(page * pageSize, filteredProducts.length)} of{" "}
            {filteredProducts.length}
          </p>

          <div>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((previous) => previous - 1)}
            >
              Previous
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((previous) => previous + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          className="sks-products-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <section
            className="sks-products-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sks-product-form-title"
          >
            <div className="sks-products-modal-heading">
              <div>
                <h2 id="sks-product-form-title">
                  {editingId !== null ? "Edit Product" : "Add New Product"}
                </h2>
                <p>Enter the product details below.</p>
              </div>
              <button
                type="button"
                aria-label="Close form"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Product Name
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Enter product name"
                  required
                />
              </label>

              <label>
                Category
                {/* <select
                  name="category"
                  value={form.category}
                  onChange={updateField}
                >
                  <option>Books</option>
                  <option>Learning Kits</option>
                  <option>Study Material</option>
                </select> */}

                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={updateField}
                  required
                >
                  <option value="">Select Category</option>

                  {categories.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name}
                    </option>
                  ))}

                </select>

              </label>

              <div className="sks-products-form-row">
                <label>
                  Price (₹)
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={updateField}
                    placeholder="0.00"
                    required
                  />
                </label>

                <label>
                  Stock Quantity
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={updateField}
                    placeholder="0"
                    required
                  />
                </label>
              </div>

              <label>
                E-book PDF {editingId !== null && "(optional)"}

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  required={editingId === null}
                  onChange={(event) => {
                    setEbook(event.target.files?.[0] || null);
                  }}
                />

                {editingId !== null && (
                  <small>
                    Leave empty to keep the existing PDF.
                  </small>
                )}
              </label>

              <label>
                E-book DOCX {editingId !== null && "(optional)"}

                <input
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required={editingId === null}
                  onChange={(event) => {
                    setDocx(event.target.files?.[0] || null);
                  }}
                />

                {editingId !== null && (
                  <small>Leave empty to keep the existing DOCX.</small>
                )}
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>

              <div className="sks-products-modal-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={saving}>
                  {/* {editingId !== null ? "Save Changes" : "Add Product"} */}
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Add Product"
                  }
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteId !== null && (
        <div className="sks-products-overlay">
          <section
            className="sks-products-modal sks-products-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sks-delete-title"
          >
            <h2 id="sks-delete-title">Delete Product?</h2>
            <p>
              This will permanently remove the product and its PDF if
              no other product uses that file. Are you sure?
            </p>
            <div className="sks-products-modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger"
                onClick={confirmDelete}
              >
                Delete Product
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
