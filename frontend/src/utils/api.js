import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? "http://localhost:8000/spa"
    : "/spa",
  timeout: 10000,
});

export default api;