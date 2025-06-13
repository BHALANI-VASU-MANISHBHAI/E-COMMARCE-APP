// src/services/socket.js
import { io } from "socket.io-client";


// Create a single, persistent socket connection
const socket = io(
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000" // Use your backend URL
  , {
  autoConnect: true, // Optional, can also manage connect/disconnect manually
});

export default socket;
