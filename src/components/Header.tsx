import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
} from "lucide-react";

import { useShop } from "@/context/ShopContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/shop",
    label: "Shop",
  },
  {
    to: "/wishlist",
    label: "Wishlist",
  },
];

const Header = () => {
  const { cartCount, wishlist } =
    useShop();

  const navigate = useNavigate();

  const [open, setOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  // SEARCH
  const handleSearch = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(
      `/shop?search=${encodeURIComponent(
        search
      )}`
    );

    setSearch("");
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container-tight flex items-center justify-between h-16 md:h-20 gap-3">
        {/* MOBILE MENU */}
        <button
          className="md:hidden p-2 -ml-2"
          onClick={() =>
            setOpen(!open)
          }
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* LOGO */}
        <Link
          to="/"
          className="font-display text-2xl md:text-3xl font-semibold tracking-tight"
        >
          webkit
          <span className="text-primary">
            .
          </span>
          store
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({
                isActive,
              }) =>
                cn(
                  "text-sm font-medium story-link transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-secondary rounded-full px-4 h-11 w-[260px]"
        >
          <Search className="h-4 w-4 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search jerseys..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="bg-transparent outline-none border-none px-3 text-sm w-full"
          />
        </form>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-1 md:gap-2">
          <Link
            to="/login"
            className="p-2.5 rounded-full hover:bg-secondary transition-smooth"
          >
            <User className="h-4.5 w-4.5" />
          </Link>

          <Link
            to="/wishlist"
            className="relative p-2.5 rounded-full hover:bg-secondary transition-smooth"
          >
            <Heart className="h-4.5 w-4.5" />

            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative p-2.5 rounded-full hover:bg-secondary transition-smooth"
          >
            <ShoppingBag className="h-4.5 w-4.5" />

            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <nav className="md:hidden border-t border-border/50 py-4 px-6 space-y-4 animate-fade-in">
          {/* MOBILE SEARCH */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-secondary rounded-full px-4 h-11"
          >
            <Search className="h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search jerseys..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="bg-transparent outline-none border-none px-3 text-sm w-full"
            />
          </form>

          {/* MOBILE LINKS */}
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() =>
                setOpen(false)
              }
              className="block text-sm font-medium"
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;