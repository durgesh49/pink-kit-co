import { Instagram, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="bg-gradient-soft border-t border-border/40 mt-24">
    <div className="container-tight py-16 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <h3 className="font-display text-2xl font-semibold">webkit<span className="text-primary">.</span>store</h3>
        <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
          Premium football drip for the new generation. Curated jerseys, fast delivery, easy returns.
        </p>
        <div className="flex gap-3 mt-5">
          <a href="#" aria-label="Instagram" className="p-2.5 rounded-full bg-card shadow-card hover:shadow-glow transition-smooth"><Instagram className="h-4 w-4" /></a>
          <a href="#" aria-label="Twitter" className="p-2.5 rounded-full bg-card shadow-card hover:shadow-glow transition-smooth"><Twitter className="h-4 w-4" /></a>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-4">Shop</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="/shop" className="hover:text-primary transition-smooth">All jerseys</a></li>
          <li><a href="/shop" className="hover:text-primary transition-smooth">Trending</a></li>
          <li><a href="/shop" className="hover:text-primary transition-smooth">Retro</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-4">Help</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-primary transition-smooth">Shipping</a></li>
          <li><a href="#" className="hover:text-primary transition-smooth">Returns</a></li>
          <li><a href="#" className="hover:text-primary transition-smooth">Contact</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} webkit.store · Made with 🩷
    </div>
  </footer>
);

export default Footer;
