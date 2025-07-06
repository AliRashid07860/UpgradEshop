import React, { useState, useEffect } from "react";
import { Grid } from '@mui/material';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import { get, post } from "../../../src/common/api"; // Our API helper
import "./Order.css";

// Steps for the Stepper
const steps = ["Product Details", "Address Details", "Order Details"];

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity, totalAmount } = location.state || {}; // Data from ProductDetails page

  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddressDialogOpen, setNewAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    contactNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    landmark: "",
  });
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Initial Checks ---
  useEffect(() => {
    // If product details are missing, redirect back to products page
    if (!product || !quantity || !totalAmount) {
      setError(
        "Product details are missing. Please select a product to order."
      );
      setTimeout(() => navigate("/products"), 2000); // Redirect after 2 seconds
    }
  }, [product, quantity, totalAmount, navigate]);

  // --- Step 1: Product Details (Display only) ---
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Product Details
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Summary
            </Typography>
            {product ? (
              <Paper elevation={1} sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <img
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/80?text=No+Image"
                      }
                      alt={product.name}
                      className="order-product-image"
                    />
                  </Grid>
                  <Grid item xs={true}>
                    <Typography variant="subtitle1">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                    <Typography variant="body2">
                      Quantity: {quantity}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Total: ₹ {totalAmount}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Alert severity="warning">Product details not available.</Alert>
            )}
          </Box>
        );
      case 1: // Address Details
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Select Delivery Address
            </Typography>
            {loading && <CircularProgress size={24} />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && addresses.length === 0 && (
              <Alert severity="info">
                No addresses found. Please add a new address.
              </Alert>
            )}
            <RadioGroup
              aria-labelledby="address-radio-buttons-group-label"
              name="address-radio-buttons-group"
              value={selectedAddress?.id || ""}
              onChange={(e) =>
                setSelectedAddress(
                  addresses.find((addr) => addr.id === e.target.value)
                )
              }
            >
              {addresses.map((addr) => (
                <Paper key={addr.id} elevation={1} sx={{ p: 2, mb: 1 }}>
                  <FormControlLabel
                    value={addr.id}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1">{addr.name}</Typography>
                        <Typography variant="body2">{`${addr.street}, ${addr.city}, ${addr.state} - ${addr.zipCode}`}</Typography>
                        <Typography variant="body2">{`Contact: ${addr.contactNumber}`}</Typography>
                        {addr.landmark && (
                          <Typography variant="body2">
                            Landmark: {addr.landmark}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </Paper>
              ))}
            </RadioGroup>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewAddressDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Add New Address
            </Button>
          </Box>
        );
      case 2: // Order Details
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Confirmation
            </Typography>
            {orderConfirmed ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Your order is confirmed!
              </Alert>
            ) : (
              error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )
            )}
            <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Product Information
              </Typography>
              <Typography variant="body1">Product: {product?.name}</Typography>
              <Typography variant="body1">Quantity: {quantity}</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Final Amount: ₹ {totalAmount}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Delivery Address
              </Typography>
              {selectedAddress ? (
                <>
                  <Typography variant="body1">
                    {selectedAddress.name}
                  </Typography>
                  <Typography variant="body2">{`${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zipCode}`}</Typography>
                  <Typography variant="body2">{`Contact: ${selectedAddress.contactNumber}`}</Typography>
                  {selectedAddress.landmark && (
                    <Typography variant="body2">
                      Landmark: {selectedAddress.landmark}
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="error">
                  No address selected.
                </Typography>
              )}
            </Paper>
            {loading && <CircularProgress />}
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  // --- Address Management ---
  const fetchAddresses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await get("/addresses");
      setAddresses(data);
      // Automatically select the first address if available
      if (data.length > 0 && !selectedAddress) {
        setSelectedAddress(data[0]);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to load addresses. Please add a new one.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeStep === 1) {
      // Fetch addresses when on Address Details step
      fetchAddresses();
    }
  }, [activeStep]);

  const handleNewAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async () => {
    setError("");
    // Basic validation
    if (
      !newAddress.name ||
      !newAddress.contactNumber ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zipCode
    ) {
      setError("Please fill all mandatory address fields.");
      return;
    }
    if (
      newAddress.contactNumber.length !== 10 ||
      !/^\d+$/.test(newAddress.contactNumber)
    ) {
      setError("Contact number must be a 10-digit number.");
      return;
    }
    if (newAddress.zipCode.length !== 6 || !/^\d+$/.test(newAddress.zipCode)) {
      setError("Zip code must be a 6-digit number.");
      return;
    }

    setLoading(true);
    try {
      const addedAddress = await post("/addresses", newAddress);
      setAddresses((prev) => [...prev, addedAddress]);
      setSelectedAddress(addedAddress); // Select the newly added address
      setNewAddressDialogOpen(false);
      setNewAddress({
        // Reset form
        name: "",
        contactNumber: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        landmark: "",
      });
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error adding new address:", err);
      setError("Failed to add address. Please check your input.");
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Stepper Navigation ---
  const handleNext = async () => {
    setError("");
    if (activeStep === 0) {
      // From Product Details to Address Details
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      // From Address Details to Order Details
      if (!selectedAddress) {
        setError("Please select an address or add a new one.");
        return;
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 2) {
      // From Order Details to Finalize Order
      // Place the actual order
      setLoading(true);
      try {
        const orderPayload = {
          addressId: selectedAddress.id,
          productId: product.id,
          quantity: quantity,
        };
        const response = await post("/orders", orderPayload);
        if (response && response.message === "Order placed successfully") {
          setOrderConfirmed(true);
          // Optionally, clear cart or update product availability in UI
        } else {
          setError(
            response.message || "Order placement failed: Invalid response."
          );
        }
      } catch (err) {
        console.error("Error placing order:", err);
        setError("Failed to place order. Please try again.");
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setOrderConfirmed(false);
    setSelectedAddress(null);
    setNewAddress({
      name: "",
      contactNumber: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      landmark: "",
    });
    setError("");
    // You might want to re-fetch product details or reset initial state from location.state
  };

  // Prevent moving forward if essential data is missing for current step
  const isNextButtonDisabled = () => {
    if (activeStep === 0 && (!product || !quantity || !totalAmount))
      return true;
    if (activeStep === 1 && (!selectedAddress || loading)) return true;
    if (activeStep === 2 && loading) return true; // Disable while placing order
    return false;
  };

  if (!product || !quantity || !totalAmount) {
    return (
      <Box className="order-error-container">
        <Alert severity="error">
          Product details are missing. Please go back to the products page and
          select an item.
        </Alert>
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
    <Box className="order-page-container">
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: "auto" }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          className="order-title"
        >
          Place Your Order
        </Typography>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          className="order-stepper"
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3, mb: 2 }}>{getStepContent(activeStep)}</Box>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0 || orderConfirmed}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={orderConfirmed ? handleReset : handleNext}
              disabled={isNextButtonDisabled() || (orderConfirmed && loading)} // Disable if confirmed and still loading after button click
            >
              {orderConfirmed ? "Place New Order" : "Place Order"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isNextButtonDisabled()}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>

      {/* Add New Address Dialog */}
      <Dialog
        open={newAddressDialogOpen}
        onClose={() => setNewAddressDialogOpen(false)}
      >
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details for your new delivery address.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={newAddress.name}
            onChange={handleNewAddressInputChange}
            required
          />
          <TextField
            margin="dense"
            name="contactNumber"
            label="Contact Number (10 digits)"
            type="tel"
            fullWidth
            variant="standard"
            value={newAddress.contactNumber}
            onChange={handleNewAddressInputChange}
            required
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            margin="dense"
            name="street"
            label="Street"
            type="text"
            fullWidth
            variant="standard"
            value={newAddress.street}
            onChange={handleNewAddressInputChange}
            required
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            variant="standard"
            value={newAddress.city}
            onChange={handleNewAddressInputChange}
            required
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            variant="standard"
            value={newAddress.state}
            onChange={handleNewAddressInputChange}
            required
          />
          <TextField
            margin="dense"
            name="zipCode"
            label="Zip Code (6 digits)"
            type="text"
            fullWidth
            variant="standard"
            value={newAddress.zipCode}
            onChange={handleNewAddressInputChange}
            required
            inputProps={{ maxLength: 6 }}
          />
          <TextField
            margin="dense"
            name="landmark"
            label="Landmark (Optional)"
            type="text"
            fullWidth
            variant="standard"
            value={newAddress.landmark}
            onChange={handleNewAddressInputChange}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {loading && <CircularProgress size={20} sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setNewAddressDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleAddAddress} disabled={loading}>
            Add Address
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Order;
