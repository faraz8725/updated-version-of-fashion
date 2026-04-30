import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer__inner">
      <div className="footer__brand">
        <h3>Halal Fashions</h3>
        <p>Modest fashion crafted with care. Suits for women and children, designed to be worn with grace.</p>
      </div>
      <div className="footer__cols">
        <div className="footer__col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/ladies">Ladies Suits</Link></li>
            <li><Link to="/kids">Kids</Link></li>
            <li><Link to="/shop">All Products</Link></li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Care</h4>
          <ul>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="footer__inner footer__bottom">
      <span>© {new Date().getFullYear()} Halal Fashions. All rights reserved.</span>
      <span>Crafted with intention.</span>
    </div>
  </footer>
);

export default Footer;
