import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { login } from "../services/authService.js";
import "../styles/Auth.css";

const Login = () => {
  const { saveSession, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect
  if (user) { navigate(from, { replace: true }); return null; }

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      const data = await login(form);
      saveSession(data);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth">
        <div className="auth__card">
          <div className="auth__eyebrow">Welcome back</div>
          <h1 className="auth__title">Sign in</h1>
          <p className="auth__sub">Enter your credentials to continue.</p>

          {apiError && <div className="auth__error">{apiError}</div>}

          <form className="auth__form" onSubmit={submit} noValidate>
            <div className="auth__field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? "error" : ""}
                autoComplete="email"
              />
              {errors.email && <p className="auth__fieldError">{errors.email}</p>}
            </div>

            <div className="auth__field">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={errors.password ? "error" : ""}
                autoComplete="current-password"
              />
              {errors.password && <p className="auth__fieldError">{errors.password}</p>}
            </div>

            <button className="auth__submit" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth__footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
