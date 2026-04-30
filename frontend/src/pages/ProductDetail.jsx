import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Minus, Plus, Star } from "lucide-react";
import Layout from "../components/Layout.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getProduct, getProducts } from "../services/productService.js";
import { useCart } from "../contexts/CartContext.jsx";
import "../styles/ProductDetail.css";

const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const { add } = useCart();

  useEffect(() => {
    if (!slug) return;
    setActiveImg(0); setQty(1); setSize(""); setMsg("");
    getProduct(slug)
      .then((p) => {
        setProduct(p);
        setSize(p.sizes?.[0] || "");
        document.title = `${p.name} — Halal Fashions`;
        return getProducts({ category: p.category });
      })
      .then((all) => setRelated(all.filter((p) => p.slug !== slug).slice(0, 4)))
      .catch(() => navigate("/shop", { replace: true }));
  }, [slug, navigate]);

  if (!product) {
    return <Layout><div style={{ padding: "5rem 1.5rem", textAlign: "center" }}>Loading…</div></Layout>;
  }

  const out = product.stock <= 0;

  const onAdd = () => {
    if (!size) { setMsg("Please select a size"); return; }
    add({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
      size,
      quantity: qty,
      slug: product.slug,
    });
    setMsg("Added to cart ✓");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <Layout>
      <div className="pdp">
        <div className="pdp__crumb">
          <Link to="/">Home</Link> /{" "}
          <Link to={`/${product.category}`}>{product.category === "ladies" ? "Ladies" : "Kids"}</Link> /{" "}
          <span>{product.name}</span>
        </div>
        <div className="pdp__layout">
          <div className="pdp__gallery">
            <div className="pdp__main">
              <img src={product.images?.[activeImg] || "/placeholder.svg"} alt={product.name} />
            </div>
            {product.images?.length > 1 && (
              <div className="pdp__thumbs">
                {product.images.map((src, i) => (
                  <button key={i} className={`pdp__thumb ${i === activeImg ? "pdp__thumb--active" : ""}`} onClick={() => setActiveImg(i)}>
                    <img src={src} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pdp__info">
            <div className="pdp__cat">{product.category === "ladies" ? "Ladies Suit" : "Kids"}</div>
            <h1 className="pdp__name">{product.name}</h1>
            {product.rating > 0 && (
              <div className="pdp__rating">
                <Star size={14} /> {product.rating.toFixed(1)}{" "}
                <span>({product.reviewCount} reviews)</span>
              </div>
            )}
            <div className="pdp__price">{formatPrice(product.price)}</div>
            <p className="pdp__desc">{product.description}</p>

            {product.sizes?.length > 0 && (
              <>
                <div className="pdp__sectionLabel">Size</div>
                <div className="pdp__sizes">
                  {product.sizes.map((s) => (
                    <button key={s} className={`pdp__size ${size === s ? "pdp__size--active" : ""}`} onClick={() => setSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="pdp__sectionLabel">Quantity</div>
            <div className="pdp__qty">
              <div className="pdp__qtyBox">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Minus size={14} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} aria-label="Increase"><Plus size={14} /></button>
              </div>
              <div className={`pdp__stock ${product.stock < 5 && product.stock > 0 ? "pdp__stock--low" : ""}`}>
                {out ? "Sold out" : product.stock < 5 ? `Only ${product.stock} left` : "In stock"}
              </div>
            </div>

            <div className="pdp__actions">
              <button className="pdp__add" onClick={onAdd} disabled={out}>
                {out ? "Sold out" : "Add to cart"}
              </button>
            </div>
            {msg && <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "var(--primary)" }}>{msg}</p>}
          </div>
        </div>

        {related.length > 0 && (
          <div className="pdp__related">
            <h2>You may also love</h2>
            <div className="grid">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
