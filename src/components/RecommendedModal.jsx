import React, { useState, useEffect } from "react";
import "./RecommendedModal.css";
import ProductCard from "./ProductCard";
import productImages from "../data/Images.json";

const RecommendedModal = ({
  recommendedProducts,
  onClose,
  addToCart,
  toggleWishlist,
  wishlist
}) => {
  const [productImagesMap, setProductImagesMap] = useState({});

  // On initial render, assign random image for each product
  useEffect(() => {
    const imagesMap = {};
    recommendedProducts.forEach((product) => {
      const category = product.CategoryName;
      const images = productImages[category];
      const randomImage = images && images.length > 0
        ? images[Math.floor(Math.random() * images.length)]
        : "/images/categories/placeholder.jpg";
      imagesMap[product.ProductID] = randomImage;
    });
    setProductImagesMap(imagesMap);
  }, [recommendedProducts]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">×</button>
        <h2>Recommended Products</h2>

        {recommendedProducts.length > 0 ? (
          <div className="recommend-grid">
            {recommendedProducts.map((product, idx) => {
              const image = productImagesMap[product.ProductID];

              return (
                <div key={idx} className="recommend-wrapper">
                  <p className="category-label">Type: {product.CategoryName}</p>

                  <ProductCard
                    product={{
                      id: product.ProductID,
                      name: product.ModelID,
                      brand: product.BrandName,
                      category: product.CategoryName,
                      specification: product.SpecificationName,
                      price: Number(product.Price),
                      feature: product.UniqueFeature,
                      stock: product.Stock,
                      image: image
                    }}
                    addToCart={addToCart}
                    toggleWishlist={toggleWishlist}
                    wishlist={wishlist}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p>No recommendations found.</p>
        )}
      </div>
    </div>
  );
};

export default RecommendedModal;

