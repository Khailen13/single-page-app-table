import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? "http://localhost:8000/spa"  // dev
    : "/spa",                      // production в Docker
  timeout: 10000,
});

export default api;