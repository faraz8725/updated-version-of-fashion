import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import Layout from "../components/Layout.jsx";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../services/productService.js";
import "../styles/Admin.css";

const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const blank = {
  name: "", description: "", price: 0,
  category: "ladies", sizes: "S, M, L",
  stock: 0, images: [], featured: false,
};

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { document.title = "Admin — Halal Fashions"; }, []);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      notify("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startCreate = () => { setEditing(null); setForm(blank); setOpen(true); };
  const startEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, price: p.price,
      category: p.category, sizes: p.sizes.join(", "),
      stock: p.stock, images: p.images, featured: p.featured,
    });
    setOpen(true);
  };

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      notify(`Uploaded ${urls.length} image${urls.length > 1 ? "s" : ""}`);
    } catch (err) {
      notify(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImg = (idx) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      images: form.images,
      featured: form.featured,
    };
    try {
      if (editing) {
        await updateProduct(editing._id, payload);
        notify("Product updated");
      } else {
        await createProduct(payload);
        notify("Product created");
      }
      setOpen(false);
      load();
    } catch (err) {
      notify(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await deleteProduct(p._id);
      notify("Deleted");
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <Layout>
      <div className="admin">
        {toast && <div className="admin__toast">{toast}</div>}

        <div className="admin__head">
          <div>
            <small>Dashboard</small>
            <h1>Products</h1>
          </div>
          <button className="admin__btn" onClick={startCreate}>
            <Plus size={14} /> New product
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>Loading…</div>
        ) : products.length === 0 ? (
          <div className="admin__empty">
            <h2>No products yet</h2>
            <p>Add your first piece to begin.</p>
          </div>
        ) : (
          <div className="admin__tableWrap">
            <table className="admin__table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td><img src={p.images?.[0] || "/placeholder.svg"} alt={p.name} /></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>{p.slug}</div>
                    </td>
                    <td style={{ textTransform: "capitalize" }}>{p.category}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="admin__actions">
                        <button className="admin__actionBtn" onClick={() => startEdit(p)}><Pencil size={12} /></button>
                        <button className="admin__actionBtn admin__actionBtn--danger" onClick={() => del(p)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <div className="admin__overlay" onClick={() => setOpen(false)}>
          <form className="admin__modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h2>{editing ? "Edit product" : "New product"}</h2>
            <p>{editing ? "Update the details below." : "Fill in the details to add a new piece."}</p>
            <div className="admin__form">
              <div className="admin__field">
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="admin__field">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="admin__formRow">
                <div className="admin__field">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="ladies">Ladies</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
                <div className="admin__field">
                  <label>Price (₹)</label>
                  <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                </div>
              </div>
              <div className="admin__formRow">
                <div className="admin__field">
                  <label>Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required />
                </div>
                <div className="admin__field">
                  <label>Sizes (comma separated)</label>
                  <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
                </div>
              </div>
              <div className="admin__field">
                <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textTransform: "none", letterSpacing: 0, fontSize: "0.9rem" }}>
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured on home page
                </label>
              </div>
              <div className="admin__field">
                <label>Images</label>
                <div className="admin__images">
                  {form.images.map((src, i) => (
                    <div key={i} className="admin__imgPreview">
                      <img src={src} alt="" />
                      <button type="button" onClick={() => removeImg(i)} aria-label="Remove">×</button>
                    </div>
                  ))}
                </div>
                <label className="admin__upload">
                  <Upload size={14} /> {uploading ? "Uploading…" : "Upload images"}
                  <input type="file" multiple accept="image/*" onChange={onUpload} disabled={uploading} />
                </label>
              </div>
            </div>
            <div className="admin__formActions">
              <button type="button" className="admin__btn admin__btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="admin__btn" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save changes" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default Admin;
