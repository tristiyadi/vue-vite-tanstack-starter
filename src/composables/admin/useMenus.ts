import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import Api from "@/services/api";
import { type MenuItem } from "@/types/types";
import { MockMenus } from "@/types/mocks";

export function useMenus() {
    return useQuery({
        queryKey: ["menus"],
        queryFn: async () => {
            try {
                const { data } = await Api.get("/admin/menus");
                return data.data as MenuItem[];
            } catch (e) {
                console.warn("API not ready, using mock menus");
                return MockMenus;
            }
        },
    });
}

export function useMenu(id: string | number) {
    return useQuery({
        queryKey: ["menu", id],
        queryFn: async () => {
            const { data } = await Api.get(`/admin/menus/${id}`);
            return data.data as MenuItem;
        },
        enabled: !!id,
    });
}

export function useCreateMenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newItem: Partial<MenuItem>) => {
            const { data } = await Api.post("/admin/menus", newItem);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menus"] });
        },
    });
}

export function useUpdateMenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            ...updates
        }: Partial<MenuItem> & { id: number }) => {
            const { data } = await Api.put(`/admin/menus/${id}`, updates);
            return data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            queryClient.invalidateQueries({ queryKey: ["menu", variables.id] });
        },
    });
}

export function useDeleteMenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await Api.delete(`/admin/menus/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menus"] });
        },
    });
}
