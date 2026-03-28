import axios from "axios";
import { BASE_URL } from "./configApi";

const api = axios.create({
  baseURL: BASE_URL
});

// Agregar access token automáticamente
api.interceptors.request.use((config) => {

  const tokenData = JSON.parse(localStorage.getItem("Token"));

  if (tokenData?.access_token) {
    config.headers.Authorization = `Bearer ${tokenData.access_token}`;
  }

  return config;
});

// Manejar expiración de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      const tokenData = JSON.parse(localStorage.getItem("Token"));

      const refreshResponse = await axios.post(
        BASE_URL + "refresh",
        {
          refresh_token: tokenData.refresh_token
        }
      );

      const newAccessToken = refreshResponse.data.access_token;

      const newTokenData = {
        ...tokenData,
        access_token: newAccessToken
      };

      localStorage.setItem("Token", JSON.stringify(newTokenData));

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;