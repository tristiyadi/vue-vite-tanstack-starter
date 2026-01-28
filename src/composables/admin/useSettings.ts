import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import Api from "@/services/api";
import { type SiteSettings } from "@/types/types";
import { MockSettings } from "@/types/mocks";

export function useSettings() {
    return useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            try {
                const { data } = await Api.get("/api/settings");
                return data.data as SiteSettings;
            } catch (e) {
                console.warn("API not ready, using mock settings");
                return MockSettings;
            }
        },
    });
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updates: Partial<SiteSettings>) => {
            const { data } = await Api.post("/api/settings", updates);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
    });
}
