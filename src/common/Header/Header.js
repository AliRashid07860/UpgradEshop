import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ isAuthenticated, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm.trim()}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("x-auth-token"); // Remove token
    localStorage.removeItem("userRole"); // Remove user role if stored
    // You might also want to remove other user-related data from localStorage
    window.location.reload(); // Reload to reflect logout state
    navigate("/login"); // Redirect to login page
  };

  return (
    <AppBar position="static" className="header-appbar">
      <Toolbar>
        <ShoppingCartIcon className="header-logo-icon" />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          className="header-title"
        >
          upGrad Eshop
        </Typography>

        {isAuthenticated && (
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="header-search-icon" />
                </InputAdornment>
              ),
              className: "header-search-input",
            }}
            className="header-search-field"
          />
        )}

        <div className="header-links">
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/products">
                Home
              </Button>
              {isAdmin && (
                <Button color="inherit" component={Link} to="/add-product">
                  Add Product
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
