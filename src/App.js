// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Component Imports
import Header from "./common/Header/Header"; // Nav Bar
import Login from "./components/auth/Login/Login";
import Signup from "./components/auth/Signup/Signup";
import Products from "./components/products/Products/Products";
import ProductDetails from "./components/products/ProductDetails/ProductDetails";
import Order from "./components/orders/Order";
import AddProduct from "./components/admin/AddProduct/AddProduct";

import "./App.css"; // आपके App-specific CSS के लिए

function App() {
  // Authentication status management will be needed here, e.g., using Context API or Redux
  // For simplicity, let's assume `isAuthenticated` and `isAdmin` state
  const isAuthenticated = false; // Replace with actual auth logic
  const isAdmin = false; // Replace with actual admin logic

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} />{" "}
      {/* Navigation Bar */}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Authenticated Routes */}
          {/* If not authenticated, redirect to login for products page */}
          <Route
            path="/products"
            element={
              isAuthenticated ? <Products /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/products/:id"
            element={
              isAuthenticated ? (
                <ProductDetails />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/order"
            element={
              isAuthenticated ? <Order /> : <Navigate to="/login" replace />
            }
          />

          {/* Admin Routes */}
          <Route
            path="/add-product"
            element={
              isAuthenticated && isAdmin ? (
                <AddProduct />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default/Home Route */}
          <Route path="/" element={<Navigate to="/products" replace />} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
