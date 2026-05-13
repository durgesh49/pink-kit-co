import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import ProductCard from "@/components/ProductCard";

import { Slider } from "@/components/ui/slider";

import { cn } from "@/lib/utils";

import { supabase } from "../supabase";

const sizes = ["S", "M", "L", "XL"];

const Shop = () => {
  const [params, setParams] =
    useSearchParams();

  const initialTeam =
    params.get("team");

  const searchQuery =
    params.get("search") || "";

  const [products, setProducts] =
    useState<any[]>([]);

  const [team, setTeam] =
    useState<string | null>(
      initialTeam
    );

  const [size, setSize] =
    useState<string | null>(null);

  const [price, setPrice] =
    useState<[number, number]>([
      500,
      10000,
    ]);

  // FETCH PRODUCTS
  const fetchProducts =
    async () => {
      const { data, error } =
        await supabase
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

  // UNIQUE TEAMS
  const teams = [
    ...new Set(
      products.map(
        (p) => p.team
      )
    ),
  ];

  // FILTER PRODUCTS
  const filtered = useMemo(() => {
    return products.filter(
      (p) => {
        const matchesTeam =
          !team ||
          p.team === team;

        const matchesPrice =
          p.price >= price[0] &&
          p.price <= price[1];

        const matchesSearch =
          !searchQuery ||
          p.name
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||
          p.team
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            );

        return (
          matchesTeam &&
          matchesPrice &&
          matchesSearch
        );
      }
    );
  }, [
    products,
    team,
    price,
    searchQuery,
  ]);

  // TEAM FILTER
  const setTeamFilter = (
    t: string | null
  ) => {
    setTeam(t);

    const currentSearch =
      params.get("search");

    if (t && currentSearch) {
      setParams({
        team: t,
        search:
          currentSearch,
      });
    } else if (t) {
      setParams({
        team: t,
      });
    } else if (
      currentSearch
    ) {
      setParams({
        search:
          currentSearch,
      });
    } else {
      setParams({});
    }
  };

  return (
    <div className="container-tight py-12 md:py-16">
      {/* HEADING */}
      <div className="text-center mb-12">
        <span className="text-primary text-sm font-medium">
          The collection
        </span>

        <h1 className="font-display text-5xl md:text-6xl font-semibold mt-2">
          Shop all jerseys
        </h1>

        <p className="text-muted-foreground mt-3">
          Curated drip from
          the world's
          biggest clubs.
        </p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-10">
        {/* SIDEBAR */}
        <aside className="space-y-8 lg:sticky lg:top-24 self-start">
          {/* TEAM */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <h3 className="font-semibold mb-3">
              Team
            </h3>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setTeamFilter(
                    null
                  )
                }
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full transition-smooth",
                  !team
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-accent"
                )}
              >
                All
              </button>

              {teams.map(
                (t, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setTeamFilter(
                        t
                      )
                    }
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full transition-smooth",
                      team ===
                        t
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-accent"
                    )}
                  >
                    {t}
                  </button>
                )
              )}
            </div>
          </div>

          {/* SIZE */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <h3 className="font-semibold mb-3">
              Size
            </h3>

            <div className="flex flex-wrap gap-2">
              {sizes.map(
                (s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setSize(
                        size ===
                          s
                          ? null
                          : s
                      )
                    }
                    className={cn(
                      "h-10 w-10 rounded-full text-sm font-medium transition-smooth",
                      size ===
                        s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-accent"
                    )}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>

          {/* PRICE */}
          <div className="bg-card rounded-3xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">
              Price
            </h3>

            <Slider
              value={price}
              onValueChange={(
                v
              ) =>
                setPrice(
                  v as [
                    number,
                    number
                  ]
                )
              }
              min={500}
              max={10000}
              step={100}
            />

            <div className="flex justify-between mt-3 text-sm text-muted-foreground">
              <span>
                ₹{price[0]}
              </span>

              <span>
                ₹{price[1]}
              </span>
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <div>
          <p className="text-sm text-muted-foreground mb-5">
            {
              filtered.length
            }{" "}
            products
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {filtered.map(
              (p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              )
            )}
          </div>

          {filtered.length ===
            0 && (
            <div className="text-center py-20 text-muted-foreground">
              No jerseys
              found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;