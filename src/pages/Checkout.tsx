import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Checkout = () => {
  const { cart, cartTotal } = useShop();
  const navigate = useNavigate();
  const shipping = cartTotal > 1500 ? 0 : 99;
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container-tight py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Nothing to check out</h1>
        <Button asChild className="rounded-full mt-6"><Link to="/shop">Shop now</Link></Button>
      </div>
    );
  }

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Payment successful! Order placed 🎉");
      setLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="container-tight py-12 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl font-semibold mb-10">Checkout</h1>
      <form onSubmit={handlePay} className="grid lg:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-6">
          <section className="bg-card rounded-3xl p-6 shadow-card">
            <h2 className="font-semibold text-lg mb-4">Contact</h2>
            <div className="space-y-3">
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required className="mt-1.5 rounded-xl" /></div>
              <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" required className="mt-1.5 rounded-xl" /></div>
            </div>
          </section>
          <section className="bg-card rounded-3xl p-6 shadow-card">
            <h2 className="font-semibold text-lg mb-4">Shipping address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label htmlFor="fn">First name</Label><Input id="fn" required className="mt-1.5 rounded-xl" /></div>
              <div><Label htmlFor="ln">Last name</Label><Input id="ln" required className="mt-1.5 rounded-xl" /></div>
              <div className="sm:col-span-2"><Label htmlFor="addr">Address</Label><Input id="addr" required className="mt-1.5 rounded-xl" /></div>
              <div><Label htmlFor="city">City</Label><Input id="city" required className="mt-1.5 rounded-xl" /></div>
              <div><Label htmlFor="pin">Pincode</Label><Input id="pin" required className="mt-1.5 rounded-xl" /></div>
            </div>
          </section>
          <section className="bg-card rounded-3xl p-6 shadow-card">
            <h2 className="font-semibold text-lg mb-2">Payment</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Lock className="h-3.5 w-3.5" /> Encrypted via Razorpay
            </div>
            <div className="bg-gradient-soft rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Razorpay</span>
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">UPI · Cards · Netbanking</span>
              </div>
              <p className="text-xs text-muted-foreground">You'll be redirected to Razorpay's secure checkout to complete payment.</p>
            </div>
          </section>
        </div>

        <aside className="bg-card rounded-3xl p-6 shadow-card h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold mb-4">Order summary</h2>
          <div className="space-y-3 max-h-64 overflow-auto pr-1">
            {cart.map((i) => (
              <div key={i.product.id + i.size} className="flex gap-3 items-center">
                <div className="w-14 h-16 rounded-xl bg-blush overflow-hidden shrink-0">
                  <img src={i.product.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{i.product.name}</p>
                  <p className="text-xs text-muted-foreground">{i.size} · ×{i.qty}</p>
                </div>
                <span className="text-sm font-semibold">₹{i.product.price * i.qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-5 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{cartTotal}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-border"><span>Total</span><span>₹{cartTotal + shipping}</span></div>
          </div>
          <Button type="submit" size="lg" disabled={loading} className="w-full rounded-full mt-5 bg-gradient-primary hover:shadow-glow h-12">
            {loading ? "Processing..." : `Pay ₹${cartTotal + shipping}`}
          </Button>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-3">
            <ShieldCheck className="h-3.5 w-3.5" /> 100% secure checkout
          </p>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
