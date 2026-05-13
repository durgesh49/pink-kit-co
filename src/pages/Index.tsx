import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { reviews } from "@/data/products";

import heroImg from "@/assets/hero-jersey.jpg";

import { supabase } from "../supabase";

const Index = () => {
  const [products, setProducts] =
    useState<any[]>([]);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // FILTERS
  const trending = products.filter(
    (p) => p.trending
  );

  const all = products.slice(0, 12);

  // TEAMS AUTO GENERATE
  const uniqueTeams = [
    ...new Set(
      products.map((p) => p.team)
    ),
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float" />

        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-primary-glow/30 blur-3xl" />

        <div className="container-tight relative grid md:grid-cols-2 gap-10 items-center py-16 md:py-24">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 bg-card/70 backdrop-blur px-4 py-1.5 rounded-full text-xs font-medium shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              New Season Drop · 2024/25
            </span>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-[0.95] mt-5">
              Latest <br />
              Football{" "}
              <em className="text-primary not-italic">
                Drip
              </em>
              .
            </h1>

            <p className="mt-5 text-lg text-muted-foreground max-w-md leading-relaxed">
              Premium jerseys from your
              favourite clubs.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-primary hover:shadow-glow h-12 px-8 text-base"
              >
                <Link to="/shop">
                  Shop Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full h-12 px-8 text-base bg-card/60"
              >
                <a href="#trending">
                  View trending
                </a>
              </Button>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute inset-4 bg-gradient-primary rounded-[3rem] blur-2xl opacity-40" />

            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-glow">
              <img
                src={heroImg}
                alt="Football jersey hero"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section
        id="trending"
        className="container-tight py-20"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-primary text-sm font-medium">
              Trending now
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2">
              This week's hottest drip
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {trending.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
            />
          ))}
        </div>
      </section>

      {/* TEAMS */}
      <section className="bg-gradient-soft py-20">
        <div className="container-tight">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium">
              Shop by team
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2">
              Pick your colours
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {uniqueTeams.map((team, i) => (
              <div
                key={i}
                className="group bg-card rounded-3xl p-6 text-center shadow-card hover-lift"
              >
                <div className="text-4xl mb-3">
                  ⚽
                </div>

                <div className="font-medium text-sm">
                  {team}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS */}
      <section className="container-tight py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-primary text-sm font-medium">
              Fresh drops
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2">
              All jerseys
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {all.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full h-12 px-8"
          >
            <Link to="/shop">
              See full collection
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-gradient-soft py-20">
        <div className="container-tight">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium">
              Loved by 12k+
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2">
              Real reviews, real drip
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-card rounded-3xl p-6 shadow-card"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({
                    length: r.rating,
                  }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>

                <p className="text-sm leading-relaxed">
                  "{r.text}"
                </p>

                <div className="mt-4 text-sm font-semibold">
                  {r.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="container-tight py-20">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Truck,
              title: "3–5 day delivery",
              text: "Fast nationwide shipping",
            },
            {
              icon: RotateCcw,
              title: "Easy returns",
              text: "Free 7-day returns",
            },
            {
              icon: ShieldCheck,
              title: "Secure payment",
              text: "100% encrypted checkout",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="bg-card rounded-3xl p-8 shadow-card"
            >
              <div className="bg-blush w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                <b.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="font-semibold text-lg">
                {b.title}
              </h3>

              <p className="text-sm text-muted-foreground mt-1.5">
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;