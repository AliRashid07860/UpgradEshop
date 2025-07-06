// authService.js
import axios from 'axios';

const BASE_URL = 'https://dev-project-ecommerce.upgrad.dev/api';

const signupUser = async (userDetails) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, userDetails);
    return response.data;
  } catch (error) {
    console.error("Signup failed", error.response?.data || error.message);
    throw error;
  }
};

export { signupUser };
