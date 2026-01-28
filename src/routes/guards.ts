import type { Router } from "vue-router";
import Cookies from "js-cookie";
import Api from "@/services/api";
import { MockSettings } from "@/types/mocks";

const getToken = () => Cookies.get("token");
const getUser = () => Cookies.get("user");

export function setupGuards(router: Router) {
    router.beforeEach(async (to, _from, next) => {
        const token = getToken();
        const user = getUser();

        let maintenanceMode = false;
        try {
            const { data } = await Api.get("/api/settings/mode");
            maintenanceMode = data.data.maintenanceMode;
        } catch (e) {
            maintenanceMode = MockSettings.maintenanceMode;
        }

        const isAdminRoute = to.matched.some(
            (record) => record.meta.requiresAuth,
        );
        const isMaintenanceRoute = to.name === "maintenance";

        if (maintenanceMode) {
            if (!isAdminRoute && !isMaintenanceRoute) {
                return next({ name: "maintenance" });
            }
        } else {
            if (isMaintenanceRoute) {
                return next({ name: "home" });
            }
        }

        const isAuthRequired = to.matched.some(
            (record) => record.meta.requiresAuth,
        );
        const isGuestRequired = to.matched.some(
            (record) => record.meta.requiresGuest,
        );

        if (isAuthRequired && !token) {
            return next({ name: "login" });
        }
        if (token && user) {
            const userObj = JSON.parse(user);
            const roleId = Number(userObj?.role_id);

            if (to.path.startsWith("/admin") && roleId !== 1) {
                return next({ name: "portal.dashboard" });
            }
            if (isGuestRequired) {
                return next(
                    roleId === 1
                        ? { name: "dashboard" }
                        : { name: "portal.dashboard" },
                );
            }
        }

        next();
    });
}
