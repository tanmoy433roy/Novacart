import React, { useState, useEffect } from 'react';
import './ChatBot.css';

const assistant = {
  name: "Sarah Wilson",
  image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
  role: "Customer Support Specialist"
};

const predefinedResponses = {
  welcome: `Hi! I'm ${assistant.name}, your NovaCart assistant. How can I help you today?`,
  products: "We offer a wide range of electronics including laptops, smartphones, headphones, and more. Check our Products page!",
  shipping: "We offer free shipping on orders above $50. Standard delivery takes 3-5 business days.",
  payment: "We accept all major credit cards, PayPal, and digital wallets.",
  returns: "Our return policy allows returns within 30 days of purchase with original packaging.",
  tracking: "You can track your order using the tracking number sent to your email after purchase.",
  warranty: "Most products come with a 1-year manufacturer warranty. Extended warranty options are available at checkout.",
  support: "Our support team is available 24/7. You can also reach us at support@novacart.com",
  price: "We regularly update our prices to ensure the best deals. Price matching is available for major retailers.",
  default: "I apologize, I don't have specific information about that. Please contact our support team for more details."
};

const menuOptions = [
  { id: 'products', label: 'Products Information' },
  { id: 'shipping', label: 'Shipping Details' },
  { id: 'payment', label: 'Payment Methods' },
  { id: 'returns', label: 'Return Policy' },
  { id: 'tracking', label: 'Order Tracking' },
  { id: 'warranty', label: 'Warranty Information' },
  { id: 'support', label: 'Customer Support' },
  { id: 'price', label: 'Pricing & Deals' }
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: predefinedResponses.welcome, sender: 'bot' }
  ]);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomePopup(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleMenuOptionClick = (optionId) => {
    const userMessage = menuOptions.find(option => option.id === optionId).label;
    const botResponse = predefinedResponses[optionId] || predefinedResponses.default;

    setMessages(prev => [
      ...prev,
      { text: userMessage, sender: 'user' },
      { text: botResponse, sender: 'bot' }
    ]);
  };

  return (
    <div className="chatbot-container">
      {showWelcomePopup && (
        <div className="welcome-popup">
          <div className="welcome-content">
            <img src={assistant.image} alt={assistant.name} className="welcome-assistant-image" />
            <p>Hi! I'm {assistant.name}. Need any help? Feel free to ask!</p>
            <button onClick={() => { setShowWelcomePopup(false); setIsOpen(true); }}>Chat Now</button>
            <button className="close-popup" onClick={() => setShowWelcomePopup(false)}>×</button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button className="assistance-button" onClick={() => setIsOpen(true)}>
          Need Assistance?
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="assistant-info">
              <img src={assistant.image} alt={assistant.name} className="assistant-image" />
              <div className="assistant-details">
                <h3>{assistant.name}</h3>
                <p>{assistant.role}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="chat-menu">
            <p>Select an option:</p>
            <div className="chat-menu-grid">
              {menuOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleMenuOptionClick(option.id)}
                  className="menu-option"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
