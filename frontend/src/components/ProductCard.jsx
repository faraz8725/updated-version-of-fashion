import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/ProductCard.css";

const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const ProductCard = ({ product, index = 0 }) => {
  const img = product.images?.[0] || "/placeholder.svg";
  const out = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product.slug}`} className="card">
        <div className="card__media">
          {product.featured && <span className="card__badge">Featured</span>}
          <img src={img} alt={product.name} loading="lazy" />
        </div>
        <div className="card__body">
          <div className="card__cat">{product.category === "ladies" ? "Ladies Suit" : "Kids"}</div>
          <h3 className="card__name">{product.name}</h3>
          <div className="card__row">
            <span className="card__price">{formatPrice(product.price)}</span>
            {product.rating > 0 && (
              <span className="card__rating">
                <Star size={13} /> {product.rating.toFixed(1)}{" "}
                <span style={{ opacity: 0.6 }}>({product.reviewCount})</span>
              </span>
            )}
          </div>
          {out && <div className="card__sold">Sold out</div>}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
