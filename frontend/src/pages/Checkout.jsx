import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Layout from "../components/Layout.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import "../styles/Checkout.css";

const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => { document.title = "Checkout — Halal Fashions"; }, []);
  useEffect(() => { if (items.length === 0 && !done) navigate("/cart", { replace: true }); }, [items.length, done, navigate]);

  const shipping = subtotal < 2500 ? 150 : 0;
  const total = subtotal + shipping;

  const submit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const id = `HF-${Date.now().toString().slice(-6)}`;
      setOrderId(id);
      setDone(true);
      clear();
      setSubmitting(false);
    }, 800);
  };

  if (done) {
    return (
      <Layout>
        <div className="checkout">
          <div className="checkout__success">
            <CheckCircle2 size={56} strokeWidth={1.2} />
            <h2>Thank you</h2>
            <p>Your order <strong>{orderId}</strong> has been received. We'll send a confirmation shortly.</p>
            <Link to="/shop" className="checkout__pay" style={{ textDecoration: "none", display: "inline-block", maxWidth: 280 }}>
              Continue shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="checkout">
        <h1>Checkout</h1>
        <div className="checkout__layout">
          <form className="checkout__form" onSubmit={submit}>
            <h3 className="checkout__sectionTitle">Contact</h3>
            <div className="checkout__field">
              <label>Email</label>
              <input type="email" required />
            </div>
            <h3 className="checkout__sectionTitle">Shipping address</h3>
            <div className="checkout__row">
              <div className="checkout__field"><label>First name</label><input required /></div>
              <div className="checkout__field"><label>Last name</label><input required /></div>
            </div>
            <div className="checkout__field"><label>Address</label><input required /></div>
            <div className="checkout__row">
              <div className="checkout__field"><label>City</label><input required /></div>
              <div className="checkout__field"><label>Postal code</label><input required /></div>
            </div>
            <div className="checkout__field"><label>Phone</label><input type="tel" required /></div>
            <h3 className="checkout__sectionTitle">Payment</h3>
            <div className="checkout__field"><label>Card number</label><input placeholder="•••• •••• •••• ••••" required /></div>
            <div className="checkout__row">
              <div className="checkout__field"><label>Expiry</label><input placeholder="MM/YY" required /></div>
              <div className="checkout__field"><label>CVC</label><input placeholder="•••" required /></div>
            </div>
            <button className="checkout__pay" type="submit" disabled={submitting}>
              {submitting ? "Processing…" : `Place order · ${formatPrice(total)}`}
            </button>
            <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", textAlign: "center", marginTop: "0.5rem" }}>
              Demo checkout — no real payment is processed.
            </p>
          </form>

          <aside className="checkout__summary">
            <h3>Order</h3>
            {items.map((i) => (
              <div key={`${i.productId}-${i.size}`} className="checkout__sumItem">
                <img src={i.image} alt={i.name} />
                <div>
                  <strong>{i.name}</strong>
                  <span>Size {i.size} · Qty {i.quantity}</span>
                </div>
                <div>{formatPrice(i.price * i.quantity)}</div>
              </div>
            ))}
            <div className="checkout__totals">
              <div className="row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="row"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : "Free"}</span></div>
              <div className="row total"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
