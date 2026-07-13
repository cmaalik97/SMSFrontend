import axios from "axios";

/*
  THIS FILE IS THE CONNECTION TO YOUR DATABASE.

  React never touches SQL Server directly - it can't, and shouldn't.
  Instead:

  React (this file) --HTTP request--> C# Controller --SqlCommand--> SQL Server

  Every function in endpoints.js calls one of these methods. Axios sends
  the request to your ASP.NET Core API (the one you built with
  Repositories/Controllers), which is the only thing that actually opens
  a SqlConnection. This file just knows the API's address and attaches
  the login token.
*/

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:5001/api",
});

// Attach the JWT (from login) to every outgoing request automatically,
// so the C# [Authorize] attributes on your controllers can read the role.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("sms_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token expires or is invalid, the API returns 401 - log the user out.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sms_token");
      localStorage.removeItem("sms_user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default client;
