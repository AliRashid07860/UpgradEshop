import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Tabs,
  Tab,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { get } from "../../../common/api"; // Our API helper
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("DEFAULT"); // DEFAULT, PRICE_HIGH_TO_LOW, PRICE_LOW_TO_HIGH, NEWEST
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let endpoint = "/products";
      let params = {};

      if (searchQuery) {
        endpoint = `/products`; // Search query is handled by the same /products endpoint
        params.name = searchQuery; // Assuming API supports 'name' for search
      } else if (selectedCategory !== "ALL") {
        endpoint = `/products`; // Filter by category
        params.category = selectedCategory;
      }

      const data = await get(endpoint, { params }); // Pass params for GET request

      let fetchedProducts = data;

      // Apply sorting logic if not handled by API directly for these parameters
      if (!searchQuery) {
        // Don't sort if it's a search result (assuming API sorts searches)
        fetchedProducts.sort((a, b) => {
          if (sortBy === "PRICE_HIGH_TO_LOW") {
            return b.price - a.price;
          } else if (sortBy === "PRICE_LOW_TO_HIGH") {
            return a.price - b.price;
          } else if (sortBy === "NEWEST") {
            // Assuming products have a 'createdAt' or similar timestamp
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          return 0; // DEFAULT or unrecognized sort
        });
      }

      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, searchQuery]);

  const fetchCategories = async () => {
    try {
      const data = await get("/products/categories");
      setCategories(["ALL", ...data]); // Add 'ALL' option
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Not setting error here, as products might still load
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, searchQuery]); // Re-fetch when category, sort or search changes

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setSearchTerm(""); // Clear search if category selected
    navigate("/products"); // Navigate to clear search query from URL
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleBuyNow = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Helper for `Header.js` search functionality
  const [searchTerm, setSearchTerm] = useState(""); // This is for local search input if any
  // The actual search filtering based on queryParams.get('search') is done in fetchProducts

  if (loading) {
    return (
      <Box className="products-loading-container">
        <CircularProgress />
        <Typography variant="h6">Loading Products...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="products-error-container">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="products-page-container">
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          aria-label="product categories"
          centered
        >
          {categories.map((cat) => (
            <Tab key={cat} label={cat} value={cat} />
          ))}
        </Tabs>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 2,
          marginRight: 2,
        }}
      >
        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="DEFAULT">Default</MenuItem>
            <MenuItem value="PRICE_HIGH_TO_LOW">Price high to low</MenuItem>
            <MenuItem value="PRICE_LOW_TO_HIGH">Price low to high</MenuItem>
            <MenuItem value="NEWEST">Newest</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {products.length === 0 && !loading && (
        <Typography variant="h6" className="products-no-results">
          No products found.
        </Typography>
      )}

      <Grid container spacing={3} className="products-grid-container">
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card className="product-card">
              <CardMedia
                component="img"
                height="180"
                image={
                  product.imageUrl ||
                  "https://via.placeholder.com/180?text=No+Image"
                }
                alt={product.name}
                className="product-card-media"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  className="product-card-title"
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="product-card-category"
                >
                  Category: {product.category}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  className="product-card-price"
                >
                  ₹ {product.price}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="product-card-description"
                >
                  {product.description?.substring(0, 70)}...{" "}
                  {/* Truncate description */}
                </Typography>
              </CardContent>
              <CardActions className="product-card-actions">
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleBuyNow(product.id)}
                  className="product-card-button"
                >
                  Buy
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Products;
