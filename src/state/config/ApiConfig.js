import axios from "axios";

export const API_BASE_URL = "ecommerce-server-production-c195.up.railway.app"

export const isValidJwt = (token) =>
    typeof token === "string" &&
    token.split(".").length === 3 &&
    token.split(".").every(Boolean);

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export const publicApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");
    if (isValidJwt(token)) {
        config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
        delete config.headers.Authorization;
    }
    return config;
});
