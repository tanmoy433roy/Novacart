import React from 'react';
import './Wishlist.css';

const Wish = ({ wishlist, handleRemoveFromWishlist, handleAddToCart }) => {
  return (
    <div className="wishlist-page">
      <h2>My Wishlist 💖</h2>

      {/* Wishlist Items */}
      {wishlist.length === 0 ? (
        <p>No items found in wishlist.</p>
      ) : (
        <div className="wishlist-container">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-item">
              <img src={item.image} alt={item.name} className="wishlist-img" />
              <div className="wishlist-details">
                <h4>{item.name}</h4>
                <p>Category: {item.category}</p>
                <p>Price: ${item.price}</p>
                <div className="wishlist-buttons">
                  <button onClick={() => handleAddToCart(item)}>Add to Cart 🛒</button>
                  <button onClick={() => handleRemoveFromWishlist(item.id)}>Remove ❌</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wish;
