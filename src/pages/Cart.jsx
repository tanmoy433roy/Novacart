import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Cart.css';
import Papa from 'papaparse';

const Cart = ({ cart, setCart, addToCart }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cart.filter((_, i) => i !== indexToRemove);
    setCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePayNow = () => {
    navigate('/checkout', { state: { cart } });
  };

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await fetch('/curated_product_sample.csv');
        const text = await response.text();
        const allProducts = Papa.parse(text, { header: true }).data;

        const cartProductIds = new Set(cart.map(p => p.id));
        const cartCategories = new Set(cart.map(p => p.category));
        const seenCategories = new Set();
        const finalRecs = [];

        const shuffled = allProducts.sort(() => 0.5 - Math.random());

        for (let item of shuffled) {
          if (!item.ProductID || cartProductIds.has(item.ProductID)) continue;

          const category = item.CategoryName;
          const alreadySeen = seenCategories.has(category);
          const alreadyInCart = cartCategories.has(category);

          if (!alreadySeen && !alreadyInCart) {
            finalRecs.push({
              id: item.ProductID,
              name: item.ModelID,
              brand: item.BrandName,
              category: item.CategoryName,
              specification: item.SpecificationName,
              price: Number(item.Price),
              feature: item.UniqueFeature,
              stock: item.Stock,
              image: `/images/categories/${category.toLowerCase().replace(/\s+/g, '')}.jpg`
            });

            seenCategories.add(category);
          }

          if (finalRecs.length >= 5) break;
        }

        setRecommendations(finalRecs);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      }
    };

    if (cart.length > 0) {
      loadRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [cart]);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((product, index) => (
            <div key={index} className="cart-section">
              <div className="cart-item">
                <img src={product.image} alt={product.name} className="cart-image" />
                <div className="cart-details">
                  <h3>{product.name}</h3>
                  <p>Category: {product.category}</p>
                  <p>Brand: {product.brand}</p>
                  <p>Price: $ {product.price}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(index)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Total: $ {total.toFixed(2)}</h3>
            <button className="pay-now-btn" onClick={handlePayNow}>Pay Now</button>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>You Might Also Like</h3>
          <div className="recommendations-grid">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="recommendation-card">
                <img src={rec.image} alt={rec.name} className="rec-image" />
                <div className="rec-details">
                  <h5><strong>{rec.name}</strong></h5>
                  <p>{rec.brand}</p>
                  <p>$ {rec.price.toFixed(2)}</p>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart({
                      id: rec.id,
                      name: rec.name,
                      brand: rec.brand,
                      category: rec.category,
                      price: rec.price,
                      image: rec.image
                    })}
                  >
                    Add to Cart
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

export default Cart;
