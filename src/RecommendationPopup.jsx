import React from "react";
import "./RecommendationPopup.css";

const RecommendationPopup = ({ product, recommendations, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose} aria-label="Close popup">
          &times;
        </button>
        <h2>Recommended for you</h2>
        <p>
          Because you viewed: <strong>{product.name}</strong>
        </p>
        <div className="recommend-grid">
          {recommendations.length > 0 ? (
            recommendations.map((item) => (
              <div key={item.id} className="recommend-card">
                <img src={item.image} alt={item.name} />
                <div className="product-title">{item.name}</div>
                <div className="product-price">₹{item.price}</div>
              </div>
            ))
          ) : (
            <p>No recommendations found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPopup;
