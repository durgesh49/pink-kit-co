import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  Trash2,
  Upload,
  Edit,
  Ticket,
  Users,
  Package,
} from "lucide-react";

import { supabase } from "../supabase";

const Admin = () => {
  const [tab, setTab] = useState("products");

  // PRODUCTS
  const [items, setItems] = useState([]);

  // TEAMS
  const [teams, setTeams] = useState([]);

  // COUPONS
  const [coupons, setCoupons] = useState([
    {
      id: crypto.randomUUID(),
      code: "DRIP10",
      off: "10%",
    },
  ]);

  // NEW PRODUCT
  const [newProduct, setNewProduct] = useState({
    name: "",
    team: "",
    price: "",
  });

  // SHOW NEW TEAM INPUT IN PRODUCT FORM
  const [showNewTeamInput, setShowNewTeamInput] = useState(false);

  // NEW TEAM
  const [newTeam, setNewTeam] = useState("");

  // NEW COUPON
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    off: "",
  });

  // IMAGE
  const [imageFile, setImageFile] = useState(null);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setItems(data);
    }
  };

  // FETCH TEAMS
  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

    if (!error && data) {
      setTeams(data);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTeams();
  }, []);

  // ADD PRODUCT
  const addProduct = async () => {
    try {
      if (
        !newProduct.name ||
        !newProduct.team ||
        !newProduct.price ||
        !imageFile
      ) {
        alert("Fill all fields");
        return;
      }

      const fileName = `${Date.now()}-${imageFile.name}`;

      // UPLOAD IMAGE
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.log(uploadError);
        alert("Image upload failed");
        return;
      }

      // GET URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      // SAVE PRODUCT
      const { error: insertError } = await supabase
        .from("products")
        .insert([
          {
            name: newProduct.name,
            team: newProduct.team,
            price: Number(newProduct.price),
            image: publicUrl,
            trending: false,
          },
        ]);

      if (insertError) {
        console.log(insertError);
        alert("Database insert failed");
        return;
      }

      alert("Product added");

      // AUTO CATEGORY SAVE
      const exists = teams.find(
        (t) => t.name.toLowerCase() === newProduct.team.toLowerCase()
      );

      if (!exists && newProduct.team.trim() !== "") {
        await supabase
          .from("teams")
          .insert([{ name: newProduct.team }]);

        fetchTeams();
      }

      fetchProducts();

      setNewProduct({
        name: "",
        team: "",
        price: "",
      });

      setImageFile(null);
      setShowNewTeamInput(false);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  // DELETE PRODUCT
  const removeProduct = async (id) => {
    await supabase
      .from("products")
      .delete()
      .eq("id", id);

    fetchProducts();
  };

  // TRENDING
  const toggleTrend = async (id, current) => {
    await supabase
      .from("products")
      .update({
        trending: !current,
      })
      .eq("id", id);

    fetchProducts();
  };

  // EDIT PRODUCT
  const updateProduct = async (product) => {
    const newName = prompt("Edit product name", product.name);

    if (!newName) return;

    const newTeam = prompt("Edit team", product.team);

    if (!newTeam) return;

    const newPrice = prompt("Edit price", product.price);

    if (!newPrice) return;

    const newImage = prompt("Edit image URL", product.image);

    if (!newImage) return;

    await supabase
      .from("products")
      .update({
        name: newName,
        team: newTeam,
        price: Number(newPrice),
        image: newImage,
      })
      .eq("id", product.id);

    fetchProducts();
  };

  // ADD TEAM
  const addTeam = async () => {
    if (!newTeam) return;

    await supabase
      .from("teams")
      .insert([{ name: newTeam }]);

    fetchTeams();
    setNewTeam("");
  };

  // EDIT TEAM
  const editTeam = async (team) => {
    const updated = prompt("Edit team", team.name);

    if (!updated) return;

    await supabase
      .from("teams")
      .update({ name: updated })
      .eq("id", team.id);

    fetchTeams();
  };

  // DELETE TEAM
  const deleteTeam = async (id) => {
    await supabase
      .from("teams")
      .delete()
      .eq("id", id);

    fetchTeams();
  };

  // ADD COUPON
  const addCoupon = () => {
    if (!newCoupon.code || !newCoupon.off) return;

    setCoupons([
      ...coupons,
      {
        id: crypto.randomUUID(),
        code: newCoupon.code,
        off: newCoupon.off,
      },
    ]);

    setNewCoupon({
      code: "",
      off: "",
    });
  };

  // EDIT COUPON
  const editCoupon = (coupon) => {
    const newCode = prompt("Edit coupon code", coupon.code);

    if (!newCode) return;

    const newOff = prompt("Edit discount", coupon.off);

    if (!newOff) return;

    setCoupons(
      coupons.map((c) =>
        c.id === coupon.id
          ? {
              ...c,
              code: newCode,
              off: newOff,
            }
          : c
      )
    );
  };

  // DELETE COUPON
  const deleteCoupon = (id) => {
    setCoupons(
      coupons.filter((c) => c.id !== id)
    );
  };

  return (
    <div className="p-10">
      {/* HEADER */}
      <div className="mb-10">
        <p className="text-pink-500 flex items-center gap-2">
          <LayoutDashboard size={18} />
          Admin
        </p>

        <h1 className="text-5xl font-bold mt-2">
          Dashboard
        </h1>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setTab("products")}
          className={`px-5 py-2 rounded-full flex items-center gap-2 ${
            tab === "products"
              ? "bg-pink-500 text-white"
              : "bg-pink-100"
          }`}
        >
          <Package size={18} />
          Products
        </button>

        <button
          onClick={() => setTab("teams")}
          className={`px-5 py-2 rounded-full flex items-center gap-2 ${
            tab === "teams"
              ? "bg-pink-500 text-white"
              : "bg-pink-100"
          }`}
        >
          <Users size={18} />
          Teams
        </button>

        <button
          onClick={() => setTab("coupons")}
          className={`px-5 py-2 rounded-full flex items-center gap-2 ${
            tab === "coupons"
              ? "bg-pink-500 text-white"
              : "bg-pink-100"
          }`}
        >
          <Ticket size={18} />
          Coupons
        </button>
      </div>

      {/* PRODUCTS */}
      {tab === "products" && (
        <div>
          <div className="bg-white p-6 rounded-3xl shadow mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Add Product
            </h2>

            <div className="grid gap-3">
              <input
                className="border p-3 rounded-xl"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    name: e.target.value,
                  })
                }
              />

              {/* TEAM SELECTOR */}
              {!showNewTeamInput ? (
                <select
                  className="border p-3 rounded-xl bg-white"
                  value={newProduct.team}
                  onChange={(e) => {
                    if (e.target.value === "__new__") {
                      setShowNewTeamInput(true);
                      setNewProduct({ ...newProduct, team: "" });
                    } else {
                      setNewProduct({ ...newProduct, team: e.target.value });
                    }
                  }}
                >
                  <option value="">Select Team</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                  <option value="__new__">+ Add New Team</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    className="border p-3 rounded-xl flex-1"
                    placeholder="Enter new team name"
                    value={newProduct.team}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, team: e.target.value })
                    }
                  />
                  <button
                    onClick={() => {
                      setShowNewTeamInput(false);
                      setNewProduct({ ...newProduct, team: "" });
                    }}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <input
                className="border p-3 rounded-xl"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: e.target.value,
                  })
                }
              />

              <label className="border-2 border-dashed border-pink-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-pink-50 hover:bg-pink-100 transition">
                <Upload className="text-pink-500 mb-2" />

                <p className="font-medium text-pink-500">
                  Click to upload image
                </p>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (
                      e.target.files &&
                      e.target.files[0]
                    ) {
                      setImageFile(
                        e.target.files[0]
                      );
                    }
                  }}
                />
              </label>

              {imageFile && (
                <p className="text-sm text-green-600">
                  {imageFile.name}
                </p>
              )}

              <button
                onClick={addProduct}
                className="bg-pink-500 text-white py-3 rounded-xl"
              >
                Add Product
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {items.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-4 shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                  <div>
                    <h3 className="font-semibold">
                      {p.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {p.team}
                    </p>

                    <p className="font-bold">
                      ₹{p.price}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleTrend(p.id, p.trending)}
                    className="p-3 rounded-full bg-pink-100 text-pink-500"
                  >
                    <Sparkles size={18} />
                  </button>

                  <button
                    onClick={() => updateProduct(p)}
                    className="p-3 rounded-full bg-blue-100 text-blue-500"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => removeProduct(p.id)}
                    className="p-3 rounded-full bg-red-100 text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEAMS */}
      {tab === "teams" && (
        <div className="bg-white p-6 rounded-3xl shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Teams
          </h2>

          <div className="flex gap-3 mb-5">
            <input
              className="border p-3 rounded-xl flex-1"
              placeholder="Add team"
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
            />

            <button
              onClick={addTeam}
              className="bg-pink-500 text-white px-5 rounded-xl"
            >
              Add
            </button>
          </div>

          <div className="grid gap-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="p-4 rounded-2xl bg-pink-50 flex justify-between items-center"
              >
                <p>{team.name}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => editTeam(team)}
                    className="p-2 rounded-full bg-blue-100 text-blue-500"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="p-2 rounded-full bg-red-100 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COUPONS */}
      {tab === "coupons" && (
        <div className="bg-white p-6 rounded-3xl shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Coupons
          </h2>

          <div className="grid gap-3 mb-5">
            <input
              className="border p-3 rounded-xl"
              placeholder="Coupon code"
              value={newCoupon.code}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  code: e.target.value,
                })
              }
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Discount (10%)"
              value={newCoupon.off}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  off: e.target.value,
                })
              }
            />

            <button
              onClick={addCoupon}
              className="bg-pink-500 text-white py-3 rounded-xl"
            >
              Add Coupon
            </button>
          </div>

          <div className="grid gap-3">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="p-4 rounded-2xl bg-pink-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {coupon.code}
                  </p>

                  <p className="text-sm text-gray-500">
                    {coupon.off} OFF
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editCoupon(coupon)}
                    className="p-2 rounded-full bg-blue-100 text-blue-500"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => deleteCoupon(coupon.id)}
                    className="p-2 rounded-full bg-red-100 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;