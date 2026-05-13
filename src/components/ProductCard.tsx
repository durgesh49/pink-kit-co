import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { cn } from "@/lib/utils";

const ProductCard = ({ product }: { product: Product }) => {
  const { wishlist, toggleWishlist } = useShop();
  const liked = wishlist.includes(product.id);

  return (
    <Link to={`/product/${product.id}`} className="group block animate-fade-in">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-blush shadow-card hover-lift">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-background/90 backdrop-blur text-foreground text-[11px] font-semibold px-3 py-1.5 rounded-full">
            {product.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          aria-label="Wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur shadow-card hover:scale-110 transition-smooth"
        >
          <Heart className={cn("h-4 w-4 transition-colors", liked ? "fill-primary text-primary" : "text-foreground/70")} />
        </button>
      </div>
      <div className="mt-4 px-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.team}</p>
        <h3 className="font-medium mt-0.5 group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold">₹{product.price}</span>
          {product.oldPrice && <span className="text-xs text-muted-foreground line-through">₹{product.oldPrice}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
