import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Layout from "../components/Layout.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts } from "../services/productService.js";
import "../styles/Shop.css";

const Shop = ({ fixedCategory, title = "Shop All", subtitle, eyebrow = "Boutique" }) => {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState(fixedCategory ? [fixedCategory] : []);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const q = params.get("q") || "";

  useEffect(() => { document.title = `${title} — Halal Fashions`; }, [title]);

  useEffect(() => {
    setLoading(true);
    getProducts(fixedCategory ? { category: fixedCategory } : {})
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fixedCategory]);

  const filtered = useMemo(() => {
    let r = [...products];
    if (q) {
      const ql = q.toLowerCase();
      r = r.filter((p) => p.name.toLowerCase().includes(ql) || p.description.toLowerCase().includes(ql));
    }
    if (!fixedCategory && cats.length) r = r.filter((p) => cats.includes(p.category));
    if (minPrice) r = r.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) r = r.filter((p) => p.price <= Number(maxPrice));
    switch (sort) {
      case "price-asc": r.sort((a, b) => a.price - b.price); break;
      case "price-desc": r.sort((a, b) => b.price - a.price); break;
      case "rating": r.sort((a, b) => b.rating - a.rating); break;
      default: r.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return r;
  }, [products, cats, minPrice, maxPrice, sort, q, fixedCategory]);

  const toggleCat = (c) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const filterPanel = (
    <aside className={`shop__filters${filtersOpen ? "" : " shop__filters--hidden"}`}>
      {!fixedCategory && (
        <div className="shop__filterGroup">
          <h3 className="shop__filterTitle">Category</h3>
          <label className="shop__option">
            <input type="checkbox" checked={cats.includes("ladies")} onChange={() => toggleCat("ladies")} />
            Ladies Suits
          </label>
          <label className="shop__option">
            <input type="checkbox" checked={cats.includes("kids")} onChange={() => toggleCat("kids")} />
            Kids
          </label>
        </div>
      )}
      <div className="shop__filterGroup">
        <h3 className="shop__filterTitle">Price (₹)</h3>
        <div className="shop__priceInputs">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <span style={{ color: "var(--muted-foreground)", flexShrink: 0 }}>—</span>
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>
    </aside>
  );

  return (
    <Layout>
      <div className="shop">
        <header className="shop__head">
          <small>{eyebrow}</small>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
          {q && (
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
              Results for <strong>"{q}"</strong>.{" "}
              <button
                onClick={() => setParams({})}
                style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}
              >
                Clear
              </button>
            </p>
          )}
        </header>

        {/* Mobile filter toggle */}
        <button className="shop__filterToggle" onClick={() => setFiltersOpen((o) => !o)}>
          <SlidersHorizontal size={15} />
          {filtersOpen ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="shop__layout">
          {filterPanel}

          <div>
            <div className="shop__resultsHead">
              <span>{loading ? "Loading…" : `${filtered.length} piece${filtered.length !== 1 ? "s" : ""}`}</span>
              <select className="shop__sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            {filtered.length === 0 && !loading ? (
              <div className="shop__empty">No products match your filters.</div>
            ) : (
              <div className="grid">
                {filtered.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
