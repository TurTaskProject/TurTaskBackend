import axios from "axios";
import { redirect } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: "Bearer " + localStorage.getItem("access_token"),
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

// handling token refresh on 401 Unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const refresh_token = localStorage.getItem("refresh_token");

    // Check if the error is due to 401 and a refresh token is available
    if (error.response && error.response.status === 401) {
      if (refresh_token) {
        return axiosInstance
          .post("/token/refresh/", { refresh: refresh_token })
          .then((response) => {
            localStorage.setItem("access_token", response.data.access);

            axiosInstance.defaults.headers["Authorization"] = "Bearer " + response.data.access;
            originalRequest.headers["Authorization"] = "Bearer " + response.data.access;

            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            console.log("Interceptors error: ", err);
          });
      } else {
        redirect("/login");
      }
    }
    return Promise.reject(error);
  }
);
