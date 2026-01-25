import axios from "axios";

export const api = axios.create({
    baseURL: "https://khlasify-widget-be.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    
})

