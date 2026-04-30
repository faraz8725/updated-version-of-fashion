import { useEffect } from "react";
import { Heart, Sparkles, Truck } from "lucide-react";
import Layout from "../components/Layout.jsx";
import "../styles/Pages.css";

const About = () => {
  useEffect(() => { document.title = "About Us — Halal Fashions"; }, []);

  return (
    <Layout>
      <div className="page">
        <div className="page__eyebrow">Our Story</div>
        <h1 className="page__title">About Halal Fashions</h1>
        <p className="page__lead">
          We believe modest fashion should never compromise on beauty, quality, or intention.
          Every piece we create is a reflection of that belief.
        </p>

        <div className="about__grid">
          <div className="about__img">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="Our atelier"
              loading="lazy"
            />
          </div>
          <div className="about__text">
            <h2>Crafted with intention</h2>
            <p>
              Halal Fashions was born from a simple desire — to create modest clothing that
              women and children could wear with pride. Our suits are hand-finished by skilled
              artisans who bring decades of craft to every stitch.
            </p>
            <p>
              We source only honest fabrics — breathable, durable, and kind to the skin.
              From the first sketch to the final button, every decision is made with care
              and with you in mind.
            </p>
            <p>
              Our collections celebrate the beauty of modesty without sacrificing elegance.
              Whether it's a quiet afternoon or a special occasion, we want you to feel
              graceful, confident, and completely yourself.
            </p>
          </div>
        </div>

        <div className="about__values">
          <div className="about__value">
            <Sparkles size={28} strokeWidth={1.5} />
            <h4>Hand-finished</h4>
            <p>Every piece detailed by skilled artisans. No two are exactly alike.</p>
          </div>
          <div className="about__value">
            <Truck size={28} strokeWidth={1.5} />
            <h4>Free shipping</h4>
            <p>Complimentary delivery on every order over ₹2,500.</p>
          </div>
          <div className="about__value">
            <Heart size={28} strokeWidth={1.5} />
            <h4>Made with intention</h4>
            <p>Modest by design. Halal sourced. Thoughtful at every step.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
