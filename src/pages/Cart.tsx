import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { cart, updateQty, removeFromCart, cartTotal } = useShop();

  if (cart.length === 0) {
    return (
      <div className="container-tight py-24 text-center">
        <div className="bg-blush w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-4xl font-semibold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Time to add some drip.</p>
        <Button asChild size="lg" className="rounded-full mt-6 bg-gradient-primary hover:shadow-glow">
          <Link to="/shop">Browse jerseys</Link>
        </Button>
      </div>
    );
  }

  const shipping = cartTotal > 1500 ? 0 : 99;

  return (
    <div className="container-tight py-12 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl font-semibold mb-10">Your cart</h1>
      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.product.id + item.size} className="bg-card rounded-3xl p-4 sm:p-5 shadow-card flex gap-4">
              <Link to={`/product/${item.product.id}`} className="shrink-0">
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-blush">
                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                </div>
              </Link>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.product.team}</p>
                    <Link to={`/product/${item.product.id}`} className="font-medium hover:text-primary transition-colors">{item.product.name}</Link>
                    <p className="text-xs text-muted-foreground mt-0.5">Size · {item.size}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id, item.size)} className="p-1.5 rounded-full hover:bg-secondary transition-smooth h-fit" aria-label="Remove">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex justify-between items-end">
                  <div className="flex items-center bg-secondary rounded-full">
                    <button onClick={() => updateQty(item.product.id, item.size, item.qty - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                    <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                    <button onClick={() => updateQty(item.product.id, item.size, item.qty + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="font-semibold">₹{item.product.price * item.qty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-card rounded-3xl p-6 shadow-card h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-2xl font-semibold">Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{cartTotal}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
            {shipping > 0 && <p className="text-xs text-primary">Add ₹{1500 - cartTotal} more for free shipping</p>}
            <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
              <span>Total</span><span>₹{cartTotal + shipping}</span>
            </div>
          </div>
          <Button asChild size="lg" className="w-full rounded-full mt-6 bg-gradient-primary hover:shadow-glow h-12">
            <Link to="/checkout">Checkout</Link>
          </Button>
          <Link to="/shop" className="block text-center text-sm text-muted-foreground mt-4 story-link mx-auto w-fit">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
