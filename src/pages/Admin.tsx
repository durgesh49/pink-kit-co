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
  Star,
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

  // IMAGES - Changed to support two images
  const [frontImageFile, setFrontImageFile] = useState(null);
  const [backImageFile, setBackImageFile] = useState(null);

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
      .order("name", {
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

  // ADD PRODUCT - Updated for dual images
  const addProduct = async () => {
    try {
      if (
        !newProduct.name ||
        !newProduct.team ||
        !newProduct.price ||
        !frontImageFile
      ) {
        alert("Fill all fields (Front image is required)");
        return;
      }

      let frontImageUrl = null;
      let backImageUrl = null;

      // Upload Front Image
      const frontFileName = `front-${Date.now()}-${frontImageFile.name}`;
      const { error: frontUploadError } = await supabase.storage
        .from("products")
        .upload(frontFileName, frontImageFile);

      if (frontUploadError) {
        console.log(frontUploadError);
        alert("Front image upload failed");
        return;
      }

      const {
        data: { publicUrl: frontPublicUrl },
      } = supabase.storage
        .from("products")
        .getPublicUrl(frontFileName);
      
      frontImageUrl = frontPublicUrl;

      // Upload Back Image (if provided)
      if (backImageFile) {
        const backFileName = `back-${Date.now()}-${backImageFile.name}`;
        const { error: backUploadError } = await supabase.storage
          .from("products")
          .upload(backFileName, backImageFile);

        if (!backUploadError) {
          const {
            data: { publicUrl: backPublicUrl },
          } = supabase.storage
            .from("products")
            .getPublicUrl(backFileName);
          backImageUrl = backPublicUrl;
        }
      }

      // SAVE PRODUCT with both images
      const { error: insertError } = await supabase
        .from("products")
        .insert([
          {
            name: newProduct.name,
            team: newProduct.team,
            price: Number(newProduct.price),
            image_front: frontImageUrl,
            image_back: backImageUrl,
            image: frontImageUrl,
            trending: false,
            premium: false,
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
          .insert([{ name: newProduct.team, show_on_homepage: false }]);

        fetchTeams();
      }

      fetchProducts();

      setNewProduct({
        name: "",
        team: "",
        price: "",
      });

      setFrontImageFile(null);
      setBackImageFile(null);
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

  // TRENDING TOGGLE
  const toggleTrend = async (id, current) => {
    await supabase
      .from("products")
      .update({
        trending: !current,
      })
      .eq("id", id);

    fetchProducts();
  };

  // PREMIUM TOGGLE (NEW)
  const togglePremium = async (id, current) => {
    await supabase
      .from("products")
      .update({
        premium: !current,
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

    const newFrontImage = prompt("Edit front image URL (or leave empty to keep current)", product.image_front || "");
    if (newFrontImage === null) return;
    
    const newBackImage = prompt("Edit back image URL (or leave empty to keep current)", product.image_back || "");
    if (newBackImage === null) return;

    const updateData = {
      name: newName,
      team: newTeam,
      price: Number(newPrice),
    };

    if (newFrontImage.trim()) {
      updateData.image_front = newFrontImage;
      updateData.image = newFrontImage;
    }
    
    if (newBackImage.trim()) {
      updateData.image_back = newBackImage;
    }

    await supabase
      .from("products")
      .update(updateData)
      .eq("id", product.id);

    fetchProducts();
  };

  // ADD TEAM
  const addTeam = async () => {
    if (!newTeam) return;

    await supabase
      .from("teams")
      .insert([{ name: newTeam, show_on_homepage: false }]);

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

  // TOGGLE TEAM ON HOMEPAGE
  const toggleTeamOnHomepage = async (team) => {
    const newValue = !team.show_on_homepage;
    const { error } = await supabase
      .from("teams")
      .update({ show_on_homepage: newValue })
      .eq("id", team.id);
    
    if (!error) {
      fetchTeams();
    } else {
      alert("Error updating team visibility");
    }
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

  // Helper function to get display image for product list
  const getDisplayImage = (product) => {
    return product.image_front || product.image || '/placeholder-image.jpg';
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

              {/* Front Image Upload */}
              <label className="border-2 border-dashed border-pink-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-pink-50 hover:bg-pink-100 transition">
                <Upload className="text-pink-500 mb-2" />
                <p className="font-medium text-pink-500">
                  Click to upload FRONT image (Required)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFrontImageFile(e.target.files[0]);
                    }
                  }}
                />
              </label>

              {frontImageFile && (
                <p className="text-sm text-green-600">
                  ✓ Front image: {frontImageFile.name}
                </p>
              )}

              {/* Back Image Upload */}
              <label className="border-2 border-dashed border-pink-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-pink-50 hover:bg-pink-100 transition">
                <Upload className="text-pink-500 mb-2" />
                <p className="font-medium text-pink-500">
                  Click to upload BACK image (Optional)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setBackImageFile(e.target.files[0]);
                    }
                  }}
                />
              </label>

              {backImageFile && (
                <p className="text-sm text-green-600">
                  ✓ Back image: {backImageFile.name}
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
                    src={getDisplayImage(p)}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
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
                    {p.image_back && (
                      <p className="text-xs text-green-600">✓ Dual images</p>
                    )}
                    {!p.image_front && p.image && (
                      <p className="text-xs text-yellow-600">Legacy product</p>
                    )}
                    {p.premium && (
                      <p className="text-xs text-amber-600">⭐ Premium</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Trending Button */}
                  <button
                    onClick={() => toggleTrend(p.id, p.trending)}
                    className={`p-3 rounded-full transition ${
                      p.trending 
                        ? "bg-pink-500 text-white" 
                        : "bg-pink-100 text-pink-500"
                    }`}
                    title={p.trending ? "Remove from trending" : "Add to trending"}
                  >
                    <Sparkles size={18} />
                  </button>

                  {/* Premium Button - NEW */}
                  <button
                    onClick={() => togglePremium(p.id, p.premium)}
                    className={`p-3 rounded-full transition ${
                      p.premium 
                        ? "bg-amber-500 text-white" 
                        : "bg-amber-100 text-amber-500"
                    }`}
                    title={p.premium ? "Remove from premium" : "Add to premium"}
                  >
                    <Star size={18} />
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Teams Management
            </h2>
            <p className="text-xs text-gray-500">
              👁️ Click eye icon to show/hide team on homepage
            </p>
          </div>

          <div className="flex gap-3 mb-5">
            <input
              className="border p-3 rounded-xl flex-1"
              placeholder="Add new team"
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
            />
            <button
              onClick={addTeam}
              className="bg-pink-500 text-white px-5 rounded-xl"
            >
              Add Team
            </button>
          </div>

          <div className="grid gap-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="p-4 rounded-2xl bg-pink-50 flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="font-semibold">{team.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {team.show_on_homepage ? '✅ Visible on homepage' : '❌ Hidden from homepage'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleTeamOnHomepage(team)}
                    className={`p-2 rounded-full transition ${
                      team.show_on_homepage 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    title={team.show_on_homepage ? "Hide from homepage" : "Show on homepage"}
                  >
                    {team.show_on_homepage ? '👁️' : '👁️‍🗨️'}
                  </button>

                  <button
                    onClick={() => editTeam(team)}
                    className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200"
                    title="Edit team name"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                    title="Delete team"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {teams.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No teams added yet. Add your first team above!
            </div>
          )}
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