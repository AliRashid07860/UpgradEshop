import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Check user login and role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // assuming user info is stored in localStorage
    if (user) {
      setIsLoggedIn(true);
      setIsAdmin(user.role === 'admin');
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Handle Search
  const handleSearch = () => {
    console.log(`Searching for ${searchTerm}`);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }}>
          <ShoppingCartIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          upGrad Eshop
        </Typography>

        {!isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Signup</Button>
          </>
        ) : (
          <>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ marginRight: 2 }}
            />
            <Button color="inherit" onClick={handleSearch}>Search</Button>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
            {isAdmin && <Button color="inherit" component={Link} to="/add-product">Add Products</Button>}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
