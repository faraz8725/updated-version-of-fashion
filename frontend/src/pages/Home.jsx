import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Truck, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "../components/Layout.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts } from "../services/productService.js";
import "../styles/Home.css";

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    document.title = "Halal Fashions — Modest Suits for Women & Children";
    getProducts({ featured: true }).then(setFeatured).catch(console.error);
  }, []);

  return (
    <Layout>
      <section className="home__hero">
        <div className="home__heroImg">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80" alt="Elegant modest suit" width={1920} height={1280} />
        </div>
        <div className="home__heroOverlay" />
        <div className="home__heroInner">
          <div className="home__heroContent">
            <div className="home__eyebrow">New · Spring Collection</div>
            <h1 className="home__title">
              Modesty,<br /><em>worn with grace.</em>
            </h1>
            <p className="home__lede">
              Hand-crafted suits for women and little ones — refined silhouettes,
              honest fabrics, and details made to be remembered.
            </p>
            <div className="home__cta">
              <Link to="/ladies" className="home__btn">Shop Ladies <ArrowRight size={16} /></Link>
              <Link to="/kids" className="home__btn home__btn--ghost">Shop Kids</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home__cats">
        <Link to="/ladies" className="home__cat">
          <img src="https://myfashionroad.com/wp-content/uploads/2024/01/ganga-cyar-hit-designs-fancy-silk-branded-ladies-suit-festive-collection-8-2023-12-15_15_16_04.jpeg" alt="Ladies suits" loading="lazy" />
          <div className="home__catLabel">
            <small>Collection 01</small>
            <h3>Ladies Suits</h3>
          </div>
        </Link>
        <Link to="/kids" className="home__cat">
          <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80" alt="Kids" loading="lazy" />
          <div className="home__catLabel">
            <small>Collection 02</small>
            <h3>Little Ones</h3>
          </div>
        </Link>
      </section>

      {featured.length > 0 && (
        <section className="home__section">
          <div className="home__sectionHead">
            <div>
              <small>Curated</small>
              <h2>Featured pieces</h2>
            </div>
            <Link to="/shop" className="home__sectionLink">View all</Link>
          </div>
          <div className="grid">
            {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>
      )}

      <section className="home__values">
        <motion.div
          className="home__valuesGrid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="home__value">
            <Sparkles size={28} strokeWidth={1.5} />
            <h4>Hand-finished</h4>
            <p>Every piece is detailed by skilled artisans. No two are exactly alike.</p>
          </div>
          <div className="home__value">
            <Truck size={28} strokeWidth={1.5} />
            <h4>Free shipping</h4>
            <p>Complimentary delivery on every order over ₹2,500. Wrapped with care.</p>
          </div>
          <div className="home__value">
            <Heart size={28} strokeWidth={1.5} />
            <h4>Made with intention</h4>
            <p>Modest by design. Halal sourced. Thoughtful at every step.</p>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Home;
