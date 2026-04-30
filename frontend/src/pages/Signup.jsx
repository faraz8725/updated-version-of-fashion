import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { signup } from "../services/authService.js";
import "../styles/Auth.css";

const Signup = () => {
  const { saveSession, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) { navigate("/", { replace: true }); return null; }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
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
      const data = await signup({ name: form.name, email: form.email, password: form.password });
      saveSession(data);
      navigate("/", { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => ({
    value: form[field],
    onChange: (e) => setForm({ ...form, [field]: e.target.value }),
    className: errors[field] ? "error" : "",
  });

  return (
    <Layout>
      <div className="auth">
        <div className="auth__card">
          <div className="auth__eyebrow">Join us</div>
          <h1 className="auth__title">Create account</h1>
          <p className="auth__sub">Start your modest fashion journey.</p>

          {apiError && <div className="auth__error">{apiError}</div>}

          <form className="auth__form" onSubmit={submit} noValidate>
            <div className="auth__field">
              <label>Full name</label>
              <input type="text" {...f("name")} autoComplete="name" />
              {errors.name && <p className="auth__fieldError">{errors.name}</p>}
            </div>

            <div className="auth__field">
              <label>Email</label>
              <input type="email" {...f("email")} autoComplete="email" />
              {errors.email && <p className="auth__fieldError">{errors.email}</p>}
            </div>

            <div className="auth__field">
              <label>Password</label>
              <input type="password" {...f("password")} autoComplete="new-password" />
              {errors.password && <p className="auth__fieldError">{errors.password}</p>}
            </div>

            <div className="auth__field">
              <label>Confirm password</label>
              <input type="password" {...f("confirm")} autoComplete="new-password" />
              {errors.confirm && <p className="auth__fieldError">{errors.confirm}</p>}
            </div>

            <button className="auth__submit" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth__footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
