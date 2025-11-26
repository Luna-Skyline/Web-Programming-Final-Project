
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Account from './components/Account';
import OrderPlaced from './components/OrderPlaced';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('furniture');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'));

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products?category=${selectedCategory}`);
      const data = await response.json();
      setProducts(data.products || []);
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

  const handleLogin = (userData, session) => {
    setUser(userData);
    setSessionId(session);
    localStorage.setItem('sessionId', session);
  };

  const handleLogout = () => {
    setUser(null);
    setSessionId(null);
    localStorage.removeItem('sessionId');
    setCart([]);
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        user={user}
        onLogout={handleLogout}
        navigateTo={navigateTo}
      />

      {currentPage === 'home' && (
        <HomePage
          products={products}
          navigateTo={navigateTo}
          setSelectedCategory={setSelectedCategory}
          viewProduct={viewProduct}
          addToCart={addToCart}
        />
      )}

      {currentPage === 'category' && (
        <CategoryPage
          products={products}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          viewProduct={viewProduct}
          addToCart={addToCart}
        />
      )}

      {currentPage === 'product' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onAddToCart={addToCart}
          navigateTo={navigateTo}
        />
      )}

      {currentPage === 'cart' && (
        <Cart
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          sessionId={sessionId}
          navigateTo={navigateTo}
        />
      )}

      {currentPage === 'account' && (
        <Account
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'order-placed' && (
        <OrderPlaced navigateTo={navigateTo} />
      )}
    </div>
  );
}

export default App;