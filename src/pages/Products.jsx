// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import Papa from "papaparse";
// import ProductCard from "../components/ProductCard";
// import RecommendedModal from "../components/RecommendedModal";
// import categoryImages from "../data/CategoryImages";
// import productImages from "../data/Images.json";

// const Products = ({ addToCart, wishlist, toggleWishlist }) => {
//   const location = useLocation();
//   const categoryFromHome = location.state?.selectedCategory || null;

//   const [allProducts, setAllProducts] = useState([]);
//   const [recommendations, setRecommendations] = useState([]);
//   const [uniqueCategories, setUniqueCategories] = useState([]);
//   const [uniqueBrands, setUniqueBrands] = useState([]);
//   const [uniqueColors, setUniqueColors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedCategoryName, setSelectedCategoryName] = useState("");
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [selectedPriceRange, setSelectedPriceRange] = useState(null);
//   const [selectedColor, setSelectedColor] = useState("");
//   const [recommendedProducts, setRecommendedProducts] = useState([]);
//   const [showRecommendation, setShowRecommendation] = useState(false);
//   const [userId, setUserId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const priceRanges = [
//     { label: "Under $500", min: 0, max: 500 },
//     { label: "$500 - $1000", min: 500, max: 1000 },
//     { label: "$1000 - $2000", min: 1000, max: 2000 },
//     { label: "Above $2000", min: 2000, max: Infinity },
//   ];

//   const getRandomImage = (category) => {
//     const images = productImages[category];
//     if (images && images.length > 0) {
//       return images[Math.floor(Math.random() * images.length)];
//     }
//     return "/images/products/default.jpg";
//   };

//   useEffect(() => {
//     let isMounted = true;

//     const loadCSV = (filePath) =>
//       new Promise((resolve, reject) => {
//         Papa.parse(filePath, {
//           download: true,
//           header: true,
//           complete: (result) => resolve(result.data),
//           error: reject,
//         });
//       });

//     const loadData = async () => {
//       try {
//         const storedUserId = localStorage.getItem("loggedInUserID");
//         if (storedUserId) setUserId(storedUserId);

//         const [productsRaw, recommendationsRaw] = await Promise.all([
//           loadCSV("/curated_product_sample.csv"),
//           loadCSV("/Recommendations.csv"),
//         ]);

//         const products = productsRaw
//           .filter((item) => item.ProductID)
//           .map((item) => ({
//             ...item,
//             Price: Number(item.Price),
//             image: getRandomImage(item.CategoryName),
//           }));

//         if (!products.length) throw new Error("No products found in CSV.");

//         const categories = Array.from(
//           new Map(products.map((p) => [p.CategoryID, p.CategoryName])).entries()
//         ).map(([id, name]) => ({ id, name }));

//         const brands = Array.from(new Set(products.map((p) => p.BrandName))).filter(Boolean);

//         const colors = Array.from(
//           new Set(products.map((p) => p.SpecificationName?.toLowerCase()))
//         ).filter(Boolean);

//         const validRecommendations = recommendationsRaw.filter(
//           (r) =>
//             r.ProductID &&
//             (r.Recommendation1 || r.Recommendation2 || r.Recommendation3)
//         );

//         const fallbackRecommendations = products.slice(0, 5).map((p, i) => ({
//           ProductID: p.ProductID,
//           Recommendation1: products[(i + 1) % products.length]?.ProductID || "",
//           Recommendation2: products[(i + 2) % products.length]?.ProductID || "",
//           Recommendation3: products[(i + 3) % products.length]?.ProductID || "",
//           Recommendation4: products[(i + 4) % products.length]?.ProductID || "",
//           Recommendation5: products[(i + 5) % products.length]?.ProductID || "",
//         }));

//         if (isMounted) {
//           setAllProducts(products);
//           setUniqueCategories(categories);
//           setUniqueBrands(brands);
//           setUniqueColors(colors);
//           setRecommendations(validRecommendations.length ? validRecommendations : fallbackRecommendations);

//           if (categoryFromHome) {
//             const matched = categories.find((cat) => cat.name === categoryFromHome);
//             if (matched) {
//               setSelectedCategory(matched.id);
//               setSelectedCategoryName(matched.name);
//             }
//           }

//           setLoading(false);
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err.message);
//           setLoading(false);
//         }
//       }
//     };

//     loadData();
//     return () => {
//       isMounted = false;
//     };
//   }, [categoryFromHome]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   const filteredCategories = uniqueCategories.filter((cat) =>
//     cat.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   let filteredProducts = allProducts;

//   if (selectedColor) {
//     filteredProducts = filteredProducts.filter((p) =>
//       p.SpecificationName?.toLowerCase().includes(selectedColor.toLowerCase())
//     );
//   }

//   if (selectedCategory) {
//     filteredProducts = filteredProducts.filter((p) => p.CategoryID === selectedCategory);
//   }

//   if (searchTerm) {
//     filteredProducts = filteredProducts.filter((p) =>
//       p.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }

//   if (selectedBrand) {
//     filteredProducts = filteredProducts.filter((p) => p.BrandName === selectedBrand);
//   }

//   if (selectedPriceRange) {
//     filteredProducts = filteredProducts.filter(
//       (p) => p.Price >= selectedPriceRange.min && p.Price < selectedPriceRange.max
//     );
//   }

//   const handleRecommendClick = (productId) => {
//     const match = recommendations.find(
//       (r) =>
//         String(r.ProductID).trim() === String(productId).trim() &&
//         (!userId || String(r.UserID).trim() === String(userId).trim())
//     );

//     let recProducts = [];

//     if (match) {
//       const recIDs = [
//         match.Recommendation1,
//         match.Recommendation2,
//         match.Recommendation3,
//         match.Recommendation4,
//         match.Recommendation5,
//       ].filter(Boolean);
//       recProducts = allProducts.filter((p) => recIDs.includes(p.ProductID));
//     }

//     if (!recProducts.length) {
//       const clicked = allProducts.find((p) => p.ProductID === productId);
//       if (clicked) {
//         recProducts = allProducts
//           .filter((p) => p.CategoryName === clicked.CategoryName && p.ProductID !== productId)
//           .slice(0, 5);
//       } else {
//         recProducts = allProducts.slice(0, 5);
//       }
//     }

//     setRecommendedProducts(recProducts);
//     setShowRecommendation(true);
//   };

//   return (
//     <div>
//       <h2>Products</h2>

//       <input
//         type="text"
//         placeholder="Search for category..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         style={{ padding: "8px", width: "100%", marginBottom: "16px" }}
//       />

//       {/* Brand filter */}
//       <select
//         value={selectedBrand}
//         onChange={(e) => setSelectedBrand(e.target.value)}
//         style={{ padding: "8px", marginBottom: "16px", width: "100%" }}
//       >
//         <option value="">All Brands</option>
//         {uniqueBrands.map((brand) => (
//           <option key={brand} value={brand}>
//             {brand}
//           </option>
//         ))}
//       </select>

//       {/* Color filter */}
//       <select
//         value={selectedColor}
//         onChange={(e) => setSelectedColor(e.target.value)}
//         style={{ padding: "8px", marginBottom: "16px", width: "100%" }}
//       >
//         <option value="">All Colors</option>
//         {uniqueColors.map((color) => (
//           <option key={color} value={color}>
//             {color}
//           </option>
//         ))}
//       </select>

//       {/* Price filter */}
//       <div style={{ margin: "16px 0" }}>
//         <h4>Filter by Price</h4>
//         <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//           {priceRanges.map((range) => (
//             <button
//               key={range.label}
//               onClick={() =>
//                 setSelectedPriceRange(
//                   selectedPriceRange?.label === range.label ? null : range
//                 )
//               }
//               style={{
//                 padding: "8px 12px",
//                 backgroundColor:
//                   selectedPriceRange?.label === range.label ? "#007bff" : "#f0f0f0",
//                 color: selectedPriceRange?.label === range.label ? "#fff" : "#000",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               {range.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {(selectedCategory || searchTerm || selectedBrand || selectedColor || selectedPriceRange) && (
//         <button
//           onClick={() => {
//             setSelectedCategory(null);
//             setSelectedCategoryName("");
//             setSearchTerm("");
//             setSelectedBrand("");
//             setSelectedColor("");
//             setSelectedPriceRange(null);
//           }}
//           style={{ margin: "20px 0" }}
//         >
//           ← Clear Filters
//         </button>
//       )}

//       {/* Conditionally render category grid or product grid */}
//       {!selectedCategory && !searchTerm && !selectedBrand && !selectedColor && !selectedPriceRange && (
//         <div
//           className="category-grid"
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//             gap: "12px",
//           }}
//         >
//           {filteredCategories.map((cat) => (
//             <div
//               key={cat.id}
//               style={{
//                 border: "1px solid #ccc",
//                 padding: "12px",
//                 borderRadius: "6px",
//                 cursor: "pointer",
//                 textAlign: "center",
//                 backgroundColor: "#f9f9f9",
//               }}
//               onClick={() => {
//                 setSelectedCategory(cat.id);
//                 setSelectedCategoryName(cat.name);
//               }}
//             >
//               <img
//                 src={categoryImages[cat.name] || "/images/categories/default.jpg"}
//                 alt={cat.name}
//                 style={{
//                   width: "100%",
//                   height: "140px",
//                   objectFit: "cover",
//                   borderRadius: "4px",
//                 }}
//               />
//               <h4 style={{ marginTop: "8px" }}>{cat.name}</h4>
//             </div>
//           ))}
//         </div>
//       )}

//       {(selectedCategory || searchTerm || selectedBrand || selectedColor || selectedPriceRange) && (
//         <>
//           <h3>
//             {selectedCategory
//               ? `${selectedCategoryName} Products`
//               : searchTerm
//               ? `Search Results for "${searchTerm}"`
//               : selectedBrand
//               ? `Brand: ${selectedBrand}`
//               : selectedColor
//               ? `Color: ${selectedColor}`
//               : selectedPriceRange
//               ? `Price: ${selectedPriceRange.label}`
//               : ""}
//           </h3>

//           {filteredProducts.length > 0 ? (
//             <div
//               className="product-grid"
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//                 gap: "16px",
//               }}
//             >
//               {filteredProducts.map((product) => (
//                 <ProductCard
//                   key={product.ProductID}
//                   product={{
//                     id: product.ProductID,
//                     name: product.ModelID,
//                     brand: product.BrandName,
//                     category: product.CategoryName,
//                     specification: product.SpecificationName,
//                     price: product.Price,
//                     feature: product.UniqueFeature,
//                     stock: product.Stock,
//                     image: product.image,
//                   }}
//                   addToCart={addToCart}
//                   toggleWishlist={toggleWishlist}
//                   wishlist={wishlist}
//                   onRecommendClick={() => handleRecommendClick(product.ProductID)}
//                 />
//               ))}
//             </div>
//           ) : (
//             <p>No products found matching your filters.</p>
//           )}
//         </>
//       )}

//       {showRecommendation && (
//         <RecommendedModal
//           recommendedProducts={recommendedProducts}
//           onClose={() => setShowRecommendation(false)}
//           addToCart={addToCart}
//           toggleWishlist={toggleWishlist}
//           wishlist={wishlist}
//         />
//       )}
//     </div>
//   );
// };

// export default Products;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Papa from "papaparse";
import ProductCard from "../components/ProductCard";
import RecommendedModal from "../components/RecommendedModal";
import categoryImages from "../data/CategoryImages";
import productImages from "../data/Images.json";

const categorySynonyms = {
  smartphones: ["smartphones", "mobile", "phones", "cellphone"],
  tablets: ["tablet", "tab", "tabs", "ipad", "ipads"],
  "wireless earbuds": ["wireless earbuds", "earphones", "earbuds", "buds", "airpods"],
  smartwatches: ["smartwatches", "watches", "wearables"],
  laptops: ["laptops", "notebooks", "macbook", "ultrabooks"],
  "gaming consoles": ["gaming consoles", "consoles", "ps5", "xbox", "playstation", "nintendo"],
  headphones: ["headphones", "headsets", "over-ear", "on-ear"],
  televisions: ["televisions", "tv", "smart tv", "led tv", "oled"],
  "pc components": ["pc components", "motherboards", "cpus", "graphics cards", "ram"],
  cameras: ["cameras", "dslr", "mirrorless", "digital cameras"],
  "bluetooth speakers": ["bluetooth speakers", "speakers", "wireless speakers"],
  monitors: ["monitors", "displays", "screens"],
  "smart home devices": ["smart home devices", "home automation", "iot devices"],
  "vr headsets": ["vr headsets", "virtual reality", "oculus", "htc vive"],
  "power banks": ["power banks", "portable chargers", "battery packs"],
  "networking devices": ["networking devices", "routers", "modems", "network switches"],
  "printers & scanners": ["printers & scanners", "printers", "scanners", "all-in-one printers"],
  projectors: ["projectors", "beamers", "home theater projectors"],
  "external storage": ["external storage", "hard drives", "ssd", "usb drives"],
  "car electronics": ["car electronics", "car audio", "dash cams", "car chargers"],
  "e-readers": ["e-readers", "kindle", "nook", "ebook readers"],
  "retro & niche gadgets": ["retro & niche gadgets", "vintage electronics", "niche tech"],
};

const findCategoryBySynonym = (term) => {
  term = term.toLowerCase();
  for (const [canonical, synonyms] of Object.entries(categorySynonyms)) {
    if (synonyms.some((syn) => syn.toLowerCase().includes(term))) {
      return canonical;
    }
  }
  return null;
};

const Products = ({ addToCart, wishlist, toggleWishlist }) => {
  const location = useLocation();
  const categoryFromHome = location.state?.selectedCategory || null;

  const [allProducts, setAllProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [uniqueBrands, setUniqueBrands] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const priceRanges = [
    { label: "Under $500", min: 0, max: 500 },
    { label: "$500 - $1000", min: 500, max: 1000 },
    { label: "$1000 - $2000", min: 1000, max: 2000 },
    { label: "Above $2000", min: 2000, max: Infinity },
  ];

  const getRandomImage = (category) => {
    const images = productImages[category];
    if (images && images.length > 0) {
      return images[Math.floor(Math.random() * images.length)];
    }
    return "/images/products/default.jpg";
  };

  useEffect(() => {
    let isMounted = true;

    const loadCSV = (filePath) =>
      new Promise((resolve, reject) => {
        Papa.parse(filePath, {
          download: true,
          header: true,
          complete: (result) => resolve(result.data),
          error: reject,
        });
      });

    const loadData = async () => {
      try {
        const storedUserId = localStorage.getItem("loggedInUserID");
        if (storedUserId) setUserId(storedUserId);

        const [productsRaw, recommendationsRaw] = await Promise.all([
          loadCSV("/curated_product_sample.csv"),
          loadCSV("/Recommendations.csv"),
        ]);

        const products = productsRaw
          .filter((item) => item.ProductID)
          .map((item) => ({
            ...item,
            Price: Number(item.Price),
            image: getRandomImage(item.CategoryName),
          }));

        if (!products.length) throw new Error("No products found in CSV.");

        const categories = Array.from(
          new Map(products.map((p) => [p.CategoryID, p.CategoryName])).entries()
        ).map(([id, name]) => ({ id, name }));

        const brands = Array.from(new Set(products.map((p) => p.BrandName))).filter(Boolean);
        const colors = Array.from(new Set(products.map((p) => p.SpecificationName?.toLowerCase()))).filter(Boolean);

        const validRecommendations = recommendationsRaw.filter(
          (r) => r.ProductID && (r.Recommendation1 || r.Recommendation2 || r.Recommendation3)
        );

        const fallbackRecommendations = products.slice(0, 5).map((p, i) => ({
          ProductID: p.ProductID,
          Recommendation1: products[(i + 1) % products.length]?.ProductID || "",
          Recommendation2: products[(i + 2) % products.length]?.ProductID || "",
          Recommendation3: products[(i + 3) % products.length]?.ProductID || "",
          Recommendation4: products[(i + 4) % products.length]?.ProductID || "",
          Recommendation5: products[(i + 5) % products.length]?.ProductID || "",
        }));

        if (isMounted) {
          setAllProducts(products);
          setUniqueCategories(categories);
          setUniqueBrands(brands);
          setUniqueColors(colors);
          setRecommendations(validRecommendations.length ? validRecommendations : fallbackRecommendations);

          if (categoryFromHome) {
            const matched = categories.find((cat) => cat.name === categoryFromHome);
            if (matched) {
              setSelectedCategory(matched.id);
              setSelectedCategoryName(matched.name);
            }
          }

          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [categoryFromHome]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const searchCategory = findCategoryBySynonym(searchTerm.trim()) || searchTerm.trim().toLowerCase();
  let filteredProducts = allProducts;

  if (selectedColor) {
    filteredProducts = filteredProducts.filter((p) =>
      p.SpecificationName?.toLowerCase().includes(selectedColor.toLowerCase())
    );
  }

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter((p) => p.CategoryID === selectedCategory);
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter((p) =>
      p.CategoryName.toLowerCase().includes(searchCategory)
    );
  }

  if (selectedBrand) {
    filteredProducts = filteredProducts.filter((p) => p.BrandName === selectedBrand);
  }

  if (selectedPriceRange) {
    filteredProducts = filteredProducts.filter(
      (p) => p.Price >= selectedPriceRange.min && p.Price < selectedPriceRange.max
    );
  }

  const handleRecommendClick = (productId) => {
    const match = recommendations.find(
      (r) => String(r.ProductID).trim() === String(productId).trim() && (!userId || String(r.UserID).trim() === String(userId).trim())
    );

    let recProducts = [];

    if (match) {
      const recIDs = [match.Recommendation1, match.Recommendation2, match.Recommendation3, match.Recommendation4, match.Recommendation5].filter(Boolean);
      recProducts = allProducts.filter((p) => recIDs.includes(p.ProductID));
    }

    if (!recProducts.length) {
      const clicked = allProducts.find((p) => p.ProductID === productId);
      if (clicked) {
        recProducts = allProducts.filter((p) => p.CategoryName === clicked.CategoryName && p.ProductID !== productId).slice(0, 5);
      } else {
        recProducts = allProducts.slice(0, 5);
      }
    }

    setRecommendedProducts(recProducts);
    setShowRecommendation(true);
  };

  return (
    <div>
      <h2>Products</h2>
      <input
        type="text"
        placeholder="Search for category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "16px" }}
      />

      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        style={{ padding: "8px", marginBottom: "16px", width: "100%" }}
      >
        <option value="">All Brands</option>
        {uniqueBrands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        style={{ padding: "8px", marginBottom: "16px", width: "100%" }}
      >
        <option value="">All Colors</option>
        {uniqueColors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>

      <div style={{ margin: "16px 0" }}>
        <h4>Filter by Price</h4>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() =>
                setSelectedPriceRange(
                  selectedPriceRange?.label === range.label ? null : range
                )
              }
              style={{
                padding: "8px 12px",
                backgroundColor:
                  selectedPriceRange?.label === range.label ? "#007bff" : "#f0f0f0",
                color: selectedPriceRange?.label === range.label ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {(selectedCategory || searchTerm || selectedBrand || selectedColor || selectedPriceRange) && (
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedCategoryName("");
            setSearchTerm("");
            setSelectedBrand("");
            setSelectedColor("");
            setSelectedPriceRange(null);
          }}
          style={{ margin: "20px 0" }}
        >
          ← Clear Filters
        </button>
      )}

      {!selectedCategory && !searchTerm && !selectedBrand && !selectedColor && !selectedPriceRange && (
        <div
          className="category-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          {uniqueCategories.map((cat) => (
            <div
              key={cat.id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "6px",
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
              }}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedCategoryName(cat.name);
              }}
            >
              <img
                src={categoryImages[cat.name] || "/images/categories/default.jpg"}
                alt={cat.name}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <h4 style={{ marginTop: "8px" }}>{cat.name}</h4>
            </div>
          ))}
        </div>
      )}

      {(selectedCategory || searchTerm || selectedBrand || selectedColor || selectedPriceRange) && (
        <>
          <h3>
            {selectedCategory
              ? `${selectedCategoryName} Products`
              : searchTerm
              ? `Search Results for "${searchTerm}"`
              : selectedBrand
              ? `Brand: ${selectedBrand}`
              : selectedColor
              ? `Color: ${selectedColor}`
              : selectedPriceRange
              ? `Price: ${selectedPriceRange.label}`
              : ""}
          </h3>

          {filteredProducts.length > 0 ? (
            <div
              className="product-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.ProductID}
                  product={{
                    id: product.ProductID,
                    name: product.ModelID,
                    brand: product.BrandName,
                    category: product.CategoryName,
                    specification: product.SpecificationName,
                    price: product.Price,
                    feature: product.UniqueFeature,
                    stock: product.Stock,
                    image: product.image,
                  }}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                  onRecommendClick={() => handleRecommendClick(product.ProductID)}
                />
              ))}
            </div>
          ) : (
            <p>No products found matching your filters.</p>
          )}
        </>
      )}

      {showRecommendation && (
        <RecommendedModal
          recommendedProducts={recommendedProducts}
          onClose={() => setShowRecommendation(false)}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          wishlist={wishlist}
        />
      )}
    </div>
  );
};

export default Products;
