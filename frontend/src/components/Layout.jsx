import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "../styles/Layout.css";

const Layout = ({ children }) => (
  <div className="layout">
    <Navbar />
    <main className="layout__main">{children}</main>
    <Footer />
  </div>
);

export default Layout;
