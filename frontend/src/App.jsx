import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext.jsx";
import { CartProvider } from "./components/CartContext.jsx";
import NavBar from "./components/NavBar.jsx";
import HomePage from "./pages/Home.jsx";
import BrowseBooksPage from "./pages/BrowseBooks.jsx";
import AboutPage from "./pages/AboutUs.jsx";
import ContactPage from "./pages/ContactUs.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import EditProfilePage from "./pages/EditProfile.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderStatusPage from "./pages/OrderStatusPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <NavBar />

          <div className="min-h-[calc(100vh-64px)] flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowseBooksPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/order-status/:orderId"
                element={<OrderStatusPage />}
              />
              <Route path="/order-history" element={<OrderHistoryPage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
            </Routes>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
