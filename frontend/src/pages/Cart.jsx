import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import Layout from "../components/Layout.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import "../styles/Cart.css";

const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const Cart = () => {
  const { items, setQty, remove, subtotal } = useCart();
  useEffect(() => { document.title = "Cart — Halal Fashions"; }, []);
  const shipping = subtotal > 0 && subtotal < 2500 ? 150 : 0;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="cart">
        <h1>Your Cart</h1>
        <p className="cart__sub">
          {items.length === 0
            ? "Your cart is currently empty."
            : `${items.length} item${items.length > 1 ? "s" : ""} ready for you.`}
        </p>

        {items.length === 0 ? (
          <div className="cart__empty">
            <ShoppingBag size={40} strokeWidth={1.2} />
            <p>Discover something you'll love.</p>
            <Link to="/shop" className="cart__checkout" style={{ display: "inline-block", maxWidth: 280 }}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="cart__layout">
            <div className="cart__list">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="cart__item">
                  <Link to={`/product/${item.slug}`} className="cart__img">
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div>
                    <h3 className="cart__name">
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <div className="cart__meta">Size {item.size} · {formatPrice(item.price)}</div>
                    <div className="cart__qty">
                      <button onClick={() => setQty(item.productId, item.size, item.quantity - 1)} aria-label="Decrease">
                        <Minus size={12} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => setQty(item.productId, item.size, item.quantity + 1)} aria-label="Increase">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button className="cart__remove" onClick={() => remove(item.productId, item.size)}>
                      Remove
                    </button>
                  </div>
                  <div className="cart__price">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div> 
            
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
/*

<aside className="cart__summary">
              <h3>Order Summary</h3>
              <div className="cart__row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="cart__row"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <div className="cart__row cart__row--total"><span>Total</span><span>{formatPrice(total)}</span></div>
              <Link to="/checkout" className="cart__checkout">Checkout</Link>
            </aside> 

            */