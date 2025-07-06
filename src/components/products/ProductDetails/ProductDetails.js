import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { get } from "../../../common/api"; // Our API helper
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (event.target.value === "") {
      setQuantity(""); // Allow clearing input
    }
  };

  const handlePlaceOrder = () => {
    if (product && quantity > 0 && quantity <= product.availableItems) {
      // Pass product details and quantity to the order page
      navigate("/order", {
        state: {
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            description: product.description,
            category: product.category,
            manufacturer: product.manufacturer,
            availableItems: product.availableItems,
          },
          quantity: quantity,
          totalAmount: product.price * quantity,
        },
      });
    } else {
      setError(
        `Please enter a valid quantity (1 to ${product?.availableItems || 0}).`
      );
    }
  };

  if (loading) {
    return (
      <Box className="product-details-loading-container">
        <CircularProgress />
        <Typography variant="h6">Loading Product Details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="product-details-error-container">
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/products")}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className="product-details-error-container">
        <Alert severity="warning">Product not found.</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/products")}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  return (
    <div className="product-details-container">
      <Paper elevation={3} className="product-details-paper">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box className="product-details-image-box">
              <img
                src={
                  product.imageUrl ||
                  "https://via.placeholder.com/300?text=No+Image"
                }
                alt={product.name}
                className="product-details-image"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="product-details-info">
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                className="product-details-title"
              >
                {product.name}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                gutterBottom
                className="product-details-price"
              >
                ₹ {product.price}
              </Typography>
              <Typography variant="body1" className="product-details-category">
                Category: {product.category}
              </Typography>
              <Typography
                variant="body1"
                className="product-details-manufacturer"
              >
                Manufacturer: {product.manufacturer}
              </Typography>
              <Typography
                variant="body1"
                className="product-details-description"
                sx={{ mt: 2 }}
              >
                {product.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Available Items: {product.availableItems}
              </Typography>

              <Box className="product-details-actions" sx={{ mt: 3 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: product.availableItems }}
                  className="product-details-quantity-input"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlaceOrder}
                  disabled={
                    quantity <= 0 ||
                    quantity > product.availableItems ||
                    product.availableItems === 0
                  }
                  className="product-details-buy-button"
                  sx={{ ml: 2 }}
                >
                  Place Order
                </Button>
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default ProductDetails;
