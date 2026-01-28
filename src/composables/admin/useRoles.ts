import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import Api from "@/services/api";
import { type Role } from "@/types/types";
import { MockRoles } from "@/types/mocks";

export function useRoles() {
    return useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            try {
                const { data } = await Api.get("/admin/roles");
                return data.data as Role[];
            } catch (e) {
                console.warn("API not ready, using mock roles");
                return MockRoles;
            }
        },
    });
}

export function useRole(id: string | number) {
    return useQuery({
        queryKey: ["role", id],
        queryFn: async () => {
            const { data } = await Api.get(`/admin/roles/${id}`);
            return data.data as Role;
        },
        enabled: !!id,
    });
}

export function useCreateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newRole: Partial<Role>) => {
            const { data } = await Api.post("/admin/roles", newRole);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
}

export function useUpdateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            ...updates
        }: Partial<Role> & { id: number }) => {
            const { data } = await Api.put(`/admin/roles/${id}`, updates);
            return data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            queryClient.invalidateQueries({ queryKey: ["role", variables.id] });
        },
    });
}

export function useDeleteRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await Api.delete(`/admin/roles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
}
