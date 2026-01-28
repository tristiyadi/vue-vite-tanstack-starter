import { useMutation, useQuery } from "@tanstack/vue-query";
import Api from "../../services/api";

export interface User {
    id: number;
    uid: string;
    name: string;
    email: string;
}
interface UserRequest {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    links?: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta?: {
        current_page: number;
        from: number;
        last_page: number;
        links?: { url: string | null; label: string; active: boolean }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

// GET all users (Paginated)
export const useUsers = (page: any = 1) =>
    useQuery<PaginatedResponse<User>, Error>({
        queryKey: ["users", page],
        queryFn: () =>
            Api.get("/api/users", {
                params: { page: typeof page === "object" ? page.value : page },
            }).then((res) => res.data),
    });

// GET user by ID
export const useUserById = (uid: string) =>
    useQuery<User>({
        queryKey: ["user", uid],
        queryFn: () =>
            Api.get(`/api/users/${uid}`).then((res) => res.data.data),
        enabled: !!uid,
    });

// POST create user
export const useUserCreate = () =>
    useMutation({
        mutationFn: (data: UserRequest) =>
            Api.post("/api/users", data).then((res) => res.data),
    });

// PUT update user
export const useUserUpdate = () =>
    useMutation({
        mutationFn: ({ uid, data }: { uid: string; data: UserRequest }) =>
            Api.put(`/api/users/${uid}`, data).then((res) => res.data),
    });

// DELETE user
export const useUserDelete = () =>
    useMutation({
        mutationFn: (uid: string) =>
            Api.delete(`/api/users/${uid}`).then((res) => res.data),
    });
