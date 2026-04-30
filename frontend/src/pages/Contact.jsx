import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Layout from "../components/Layout.jsx";
import "../styles/Pages.css";

const Contact = () => {
  useEffect(() => { document.title = "Contact — Halal Fashions"; }, []);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send — replace with real API call if needed
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 800);
  };

  const f = (field) => ({
    value: form[field],
    onChange: (e) => setForm({ ...form, [field]: e.target.value }),
  });

  return (
    <Layout>
      <div className="page">
        <div className="page__eyebrow">Get in touch</div>
        <h1 className="page__title">Contact Us</h1>
        <p className="page__lead">
          Have a question about sizing, an order, or just want to say hello?
          We'd love to hear from you.
        </p>

        <div className="contact__grid">
          <div className="contact__info">
            <h2>We're here to help</h2>
            <p>
              Our team typically responds within 24 hours on business days.
              For urgent queries, please reach us by phone.
            </p>

            <div className="contact__detail">
              <Mail size={18} />
              <span>hello@halalfashions.in</span>
            </div>
            <div className="contact__detail">
              <Phone size={18} />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact__detail">
              <MapPin size={18} />
              <span>123 Boutique Lane, Mumbai, Maharashtra 400001</span>
            </div>
          </div>

          <div>
            {sent && (
              <div className="contact__success" style={{ marginBottom: "1rem" }}>
                ✓ Message sent! We'll get back to you shortly.
              </div>
            )}
            <form className="contact__form" onSubmit={submit}>
              <div className="contact__field">
                <label>Your name</label>
                <input type="text" {...f("name")} required />
              </div>
              <div className="contact__field">
                <label>Email</label>
                <input type="email" {...f("email")} required />
              </div>
              <div className="contact__field">
                <label>Subject</label>
                <input type="text" {...f("subject")} required />
              </div>
              <div className="contact__field">
                <label>Message</label>
                <textarea {...f("message")} required />
              </div>
              <button className="contact__submit" type="submit" disabled={loading}>
                {loading ? "Sending…" : "Send message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
