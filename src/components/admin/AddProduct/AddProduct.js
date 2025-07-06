import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { post, get } from "../../../common/api"; // Our API helper
import "./AddProduct.css";

const AddProduct = () => {
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    manufacturer: "",
    availableItems: "",
    imageUrl: "", // Optional image URL
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        // Assuming there's an API endpoint to get all existing categories for product creation
        const data = await get("/products/categories");
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories for Add Product:", err);
        setError("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    const { name, category, price, description, manufacturer, availableItems } =
      productDetails;
    if (
      !name ||
      !category ||
      !price ||
      !description ||
      !manufacturer ||
      !availableItems
    ) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number.");
      return;
    }

    if (isNaN(availableItems) || parseInt(availableItems, 10) <= 0) {
      setError("Available items must be a positive integer.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...productDetails,
        price: parseFloat(productDetails.price),
        availableItems: parseInt(productDetails.availableItems, 10),
      };
      const response = await post("/products", payload); // API endpoint for creating product

      if (
        response &&
        response.message === `Product ${productDetails.name} added successfully`
      ) {
        setSuccess(`Product ${productDetails.name} added successfully!`);
        // Clear form after successful submission
        setProductDetails({
          name: "",
          category: "",
          price: "",
          description: "",
          manufacturer: "",
          availableItems: "",
          imageUrl: "",
        });
      } else {
        setError(
          response.message ||
            "Failed to add product: Invalid response from server."
        );
      }
    } catch (err) {
      console.error("Add Product error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred while adding product.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <Paper elevation={3} className="add-product-paper">
        <Typography variant="h5" component="h1" className="add-product-title">
          Add New Product
        </Typography>
        {error && (
          <Alert severity="error" className="add-product-alert">
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" className="add-product-alert">
            {success}
          </Alert>
        )}
        <form onSubmit={handleAddProduct} className="add-product-form">
          <TextField
            label="Product Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={productDetails.name}
            onChange={handleInputChange}
            required
          />
          <FormControl fullWidth margin="normal" variant="outlined" required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={productDetails.category}
              onChange={handleInputChange}
              label="Category"
            >
              {/* Option to create a new category or select existing */}
              <MenuItem value="">
                <em>Select or Type New</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* If the category is not from predefined list, allow text input */}
          {!categories.includes(productDetails.category) &&
            productDetails.category !== "" && (
              <TextField
                label="New Category Name"
                name="category"
                variant="outlined"
                fullWidth
                margin="normal"
                value={productDetails.category}
                onChange={handleInputChange}
                helperText="Enter new category name if not listed above"
              />
            )}

          <TextField
            label="Price"
            name="price"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={productDetails.price}
            onChange={handleInputChange}
            required
            inputProps={{ step: "0.01" }}
          />
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={productDetails.description}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Manufacturer"
            name="manufacturer"
            variant="outlined"
            fullWidth
            margin="normal"
            value={productDetails.manufacturer}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Available Items"
            name="availableItems"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={productDetails.availableItems}
            onChange={handleInputChange}
            required
            inputProps={{ min: "1", step: "1" }}
          />
          <TextField
            label="Image URL (Optional)"
            name="imageUrl"
            variant="outlined"
            fullWidth
            margin="normal"
            value={productDetails.imageUrl}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="add-product-button"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
        <Box mt={2}>
          <Button onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default AddProduct;
