import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to attach bearer token
Api.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle session expiry (401)
Api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove("token");
            Cookies.remove("user");

            if (window.location.pathname.startsWith("/admin")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    },
);

export default Api;
