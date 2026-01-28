import { useMutation } from "@tanstack/vue-query";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import Api from "../../services/api";

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
interface LoginRequest {
    email: string;
    password: string;
}

export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            const response = await Api.post("/api/login", data);
            return response.data;
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async (data: RegisterRequest) => {
            const response = await Api.post("/api/register", data);
            return response.data;
        },
    });
};

export const useLogout = (): (() => void) => {
    const router = useRouter();
    const logout = (): void => {
        Cookies.remove("token");
        Cookies.remove("user");
        router.push({ name: "login" });
    };
    return logout;
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: async (data: { email: string }) => {
            const response = await Api.post("/api/forgot-password", data);
            return response.data;
        },
    });
};

export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await Api.post("/api/profile", data);
            if (response.data.data) {
                Cookies.set("user", JSON.stringify(response.data.data), {
                    expires: 7,
                });
            }

            return response.data;
        },
    });
};
