import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Account from './components/Account';
import OrderPlaced from './components/OrderPlaced';
import NewsletterPopup from './components/NewsletterPopup';
import './styles/App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'));

  useEffect(() => {
    fetchProducts();
    
    // Show newsletter popup after 3 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('newsletterSeen');
      if (!hasSeenPopup) {
        setShowNewsletter(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?category=${selectedCategory}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleLogin = (userData, sessionId) => {
    setUser(userData);
    setSessionId(sessionId);
    localStorage.setItem('sessionId', sessionId);
  };

  const handleLogout = () => {
    setUser(null);
    setSessionId(null);
    localStorage.removeItem('sessionId');
    setCart([]);
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          user={user}
          onLogout={handleLogout}
        />
        
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <main className="main-content">
                <div className="container">
                  <section className="category-filter">
                    <h2>Browse by Category</h2>
                    <div className="category-buttons">
                      {['all', 'furniture', 'tables', 'chairs', 'beds', 'shelves', 'drawers'].map(cat => (
                        <button
                          key={cat}
                          className={selectedCategory === cat ? 'active' : ''}
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="products-grid">
                    {products.map(product => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={addToCart}
                      />
                    ))}
                  </section>
                </div>
              </main>
            </>
          } />
          
          <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} sessionId={sessionId} />} />
          <Route path="/account" element={<Account user={user} onLogin={handleLogin} />} />
          <Route path="/order-placed" element={<OrderPlaced />} />
        </Routes>

        {showNewsletter && (
          <NewsletterPopup onClose={() => {
            setShowNewsletter(false);
            localStorage.setItem('newsletterSeen', 'true');
          }} />
        )}
      </div>
    </Router>
  );
}

export default App;