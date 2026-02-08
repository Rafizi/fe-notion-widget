// lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: "https://khlasify-widget-be.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

// Logic Interceptor: Biar semua request otomatis bawa token
api.interceptors.request.use((config) => {
    const token = Cookies.get("login_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});