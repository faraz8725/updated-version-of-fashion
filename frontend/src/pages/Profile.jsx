import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, ShoppingBag } from "lucide-react";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import "../styles/Profile.css";

const Profile = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = "My Profile — Halal Fashions"; }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  const joined = new Date(user.createdAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <Layout>
      <div className="profile">
        <div className="profile__eyebrow">Account</div>
        <h1 className="profile__title">My Profile</h1>

        {/* Account details */}
        <div className="profile__card">
          <h2>Account Details</h2>
          <div className="profile__row">
            <span className="profile__label">Name</span>
            <span className="profile__value">{user.name}</span>
          </div>
          <div className="profile__row">
            <span className="profile__label">Email</span>
            <span className="profile__value">{user.email}</span>
          </div>
          <div className="profile__row">
            <span className="profile__label">Role</span>
            <span className="profile__value">
              <span className={`profile__badge profile__badge--${user.role}`}>
                {user.role}
              </span>
            </span>
          </div>
          {user.createdAt && (
            <div className="profile__row">
              <span className="profile__label">Member since</span>
              <span className="profile__value">{joined}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="profile__card">
          <h2>Quick Links</h2>
          <div className="profile__actions">
            <Link to="/shop" className="profile__btn profile__btn--ghost">
              <ShoppingBag size={15} /> Continue Shopping
            </Link>

            {isAdmin && (
              <Link to="/admin" className="profile__btn profile__btn--primary">
                <LayoutDashboard size={15} /> Go to Admin Panel
              </Link>
            )}

            <button className="profile__btn profile__btn--danger" onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
