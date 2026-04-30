import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const NotFound = () => (
  <Layout>
    <div style={{ textAlign: "center", padding: "8rem 1.5rem" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "4rem", fontWeight: 500, marginBottom: "1rem" }}>404</h1>
      <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>This page doesn't exist.</p>
      <Link to="/" style={{
        display: "inline-block", padding: "1rem 2rem",
        background: "var(--primary)", color: "var(--primary-foreground)",
        textDecoration: "none", fontSize: "0.85rem", letterSpacing: "0.18em", textTransform: "uppercase",
      }}>
        Go home
      </Link>
    </div>
  </Layout>
);

export default NotFound;
