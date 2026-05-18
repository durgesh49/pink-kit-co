import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Heart,
  ShoppingBag,
  User,
  Search,
} from "lucide-react";

import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

import { cn } from "@/lib/utils";

import { useState } from "react";

const Header = () => {
  const { cartCount, wishlist } =
    useShop();

  const {
    user,
    logout,
    isAdmin,
  } = useAuth();

  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

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

        {/* LOGO */}
        <Link
          to="/"
          onClick={() => {
            setTimeout(() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }, 100);
          }}
          className="font-display text-2xl md:text-3xl font-semibold tracking-tight"
        >
          webkit
          <span className="text-primary">
            .
          </span>
          store
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-8">

          {/* HOME */}
          <button
            onClick={() => {
              navigate("/");

              setTimeout(() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }, 100);
            }}
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Home
          </button>

          {/* SHOP */}
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              cn(
                "text-sm font-medium story-link transition-colors",
                isActive
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              )
            }
          >
            Shop
          </NavLink>

          {/* WISHLIST */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              cn(
                "text-sm font-medium story-link transition-colors",
                isActive
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              )
            }
          >
            Wishlist
          </NavLink>

          {/* ADMIN */}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium story-link transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground"
                )
              }
            >
              Admin
            </NavLink>
          )}
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* LOGIN / LOGOUT */}
          {user ? (
            <button
              onClick={async () => {
                await logout();

                navigate("/");

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="p-2.5 rounded-full hover:bg-secondary transition-smooth"
            >
              <User className="h-4.5 w-4.5" />
            </Link>
          )}

          {/* WISHLIST */}
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

          {/* CART */}
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
    </header>
  );
};

export default Header;