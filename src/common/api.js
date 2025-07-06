// src/common/api.js
import axios from "axios";

const API_BASE_URL = "https://dev-project-ecommerce.upgrad.dev/api";

const getAuthToken = () => {
  return localStorage.getItem("x-auth-token");
};

export const get = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "x-auth-token": getAuthToken(),
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const post = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error posting data to ${endpoint}:`,
      error.response || error
    );
    throw error;
  }
};

export const put = async (endpoint, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
      headers: {
        "x-auth-token": getAuthToken(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error putting data to ${endpoint}:`, error);
    throw error;
  }
};

export const remove = async (endpoint) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "x-auth-token": getAuthToken(),
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting data from ${endpoint}:`, error);
    throw error;
  }
};
