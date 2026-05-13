import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, Star, Truck, RotateCcw, ShieldCheck, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useShop } from "@/context/ShopContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/supabase";

const sizes = ["S", "M", "L", "XL"];

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const navigate = useNavigate();

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProduct(data);
        
        // Fetch related products
        const { data: relatedData } = await supabase
          .from("products")
          .select("*")
          .eq("team", data.team)
          .neq("id", data.id)
          .limit(4);
        
        if (relatedData) setRelated(relatedData);
      }
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="container-tight py-20 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="container-tight py-20 text-center">Product not found. <Link to="/shop" className="text-primary">Back to shop</Link></div>;
  }

  const liked = wishlist.includes(product.id);
  // const related = products.filter((p) => p.team === product.team && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product, size);
    toast.success(`Added to cart · Size ${size}`);
  };
  const handleBuy = () => { handleAdd(); navigate("/cart"); };

  return (
    <div className="container-tight py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-blush shadow-card">
            <img src={product.image} alt={product.name} width={800} height={1000} className="h-full w-full object-cover" />
          </div>
          {product.badge && (
            <span className="absolute top-4 left-4 bg-card text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-card">{product.badge}</span>
          )}
        </div>

        <div className="animate-fade-in">
          <p className="text-xs uppercase tracking-widest text-primary font-medium">{product.team}</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-2">{product.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
            </div>
            <span className="text-sm text-muted-foreground">4.9 · 248 reviews</span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-semibold">₹{product.price}</span>
            {product.oldPrice && <span className="text-lg text-muted-foreground line-through">₹{product.oldPrice}</span>}
          </div>

          <p className="text-muted-foreground mt-5 leading-relaxed">{product.description || "Premium quality jersey with authentic design. Perfect for match day or casual wear."}</p>

          <div className="mt-7">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Size</span>
              <button className="text-xs text-muted-foreground story-link">Size guide</button>
            </div>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn("h-12 w-12 rounded-2xl text-sm font-medium transition-smooth", size === s ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary hover:bg-accent")}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-medium">Qty</span>
            <div className="flex items-center bg-secondary rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5"><Minus className="h-3.5 w-3.5" /></button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2.5"><Plus className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Button onClick={handleAdd} size="lg" variant="outline" className="rounded-full h-12 px-8 flex-1">Add to cart</Button>
            <Button onClick={handleBuy} size="lg" className="rounded-full h-12 px-8 flex-1 bg-gradient-primary hover:shadow-glow transition-smooth">Buy now</Button>
            <button onClick={() => toggleWishlist(product.id)} aria-label="Wishlist" className="h-12 w-12 rounded-full bg-secondary hover:bg-accent flex items-center justify-center transition-smooth shrink-0">
              <Heart className={cn("h-5 w-5", liked && "fill-primary text-primary")} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: Truck, label: "Fast delivery" },
              { icon: RotateCcw, label: "Easy returns" },
              { icon: ShieldCheck, label: "Secure pay" },
            ].map((b) => (
              <div key={b.label} className="bg-secondary rounded-2xl p-3">
                <b.icon className="h-4 w-4 mx-auto text-primary" />
                <div className="text-[11px] mt-1.5 font-medium">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-24">
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">Reviews</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { rating: 5, text: "Absolutely love this jersey! Quality is amazing and fits perfectly.", name: "Rahul S." },
            { rating: 5, text: "Best purchase ever. The fabric is so comfortable.", name: "Priya M." }
          ].map((r, i) => (
            <div key={i} className="bg-card rounded-3xl p-6 shadow-card">
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-sm leading-relaxed">"{r.text}"</p>
              <div className="mt-3 text-sm font-semibold">{r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">You might also love</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default Product;