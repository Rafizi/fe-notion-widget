// lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: "https://khlasify-widget-be.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const rawToken = Cookies.get("login_token");
    
    if (rawToken) {
        // CLEANUP: Hapus spasi dan baris baru di awal/akhir/tengah token
        const cleanToken = rawToken.replace(/[\n\r\t]/g, "").trim();
        
        // JANGAN TEKAN ENTER DI SINI! Tulis dalam satu baris rapat
        config.headers.Authorization = `Bearer ${cleanToken}`;
        
        console.log("🛠️ Header Sent:", config.headers.Authorization);
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});