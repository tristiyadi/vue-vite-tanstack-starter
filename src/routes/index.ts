import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";
import { setupGuards } from "./guards";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: () => import("../components/layout/PublicLayout.vue"),
        children: [
            {
                path: "",
                name: "home",
                meta: { isPublic: true },
                component: () => import("../views/home/index.vue"),
            },
            {
                path: "register",
                name: "register",
                meta: { requiresGuest: true, isPublic: true },
                component: () => import("../views/auth/register.vue"),
            },
            {
                path: "login",
                name: "login",
                meta: { requiresGuest: true, isPublic: true },
                component: () => import("../views/auth/login.vue"),
            },
            {
                path: "forgot-password",
                name: "forgot-password",
                meta: { requiresGuest: true, isPublic: true },
                component: () => import("../views/auth/forgot-password.vue"),
            },
        ],
    },
    {
        path: "/maintenance",
        name: "maintenance",
        meta: { isPublic: true },
        component: () => import("../views/maintenance/index.vue"),
    },
    {
        path: "/admin",
        component: () => import("../components/layout/AdminLayout.vue"),
        meta: { requiresAuth: true },
        children: [
            {
                path: "dashboard",
                name: "dashboard",
                component: () => import("../views/admin/dashboard/index.vue"),
            },
            {
                path: "users",
                name: "admin.users.index",
                component: () => import("../views/admin/users/index.vue"),
            },
            {
                path: "users/create",
                name: "admin.users.create",
                component: () => import("../views/admin/users/create.vue"),
            },
            {
                path: "users/edit/:uid",
                name: "admin.users.edit",
                component: () => import("../views/admin/users/edit.vue"),
            },
            {
                path: "roles",
                children: [
                    {
                        path: "",
                        name: "admin.roles.index",
                        component: () =>
                            import("../views/admin/roles/index.vue"),
                    },
                    {
                        path: "create",
                        name: "admin.roles.create",
                        component: () =>
                            import("../views/admin/roles/create.vue"),
                    },
                    {
                        path: ":id/edit",
                        name: "admin.roles.edit",
                        component: () =>
                            import("../views/admin/roles/edit.vue"),
                    },
                ],
            },
            {
                path: "menus",
                children: [
                    {
                        path: "",
                        name: "admin.menus.index",
                        component: () =>
                            import("../views/admin/menus/index.vue"),
                    },
                    {
                        path: "create",
                        name: "admin.menus.create",
                        component: () =>
                            import("../views/admin/menus/create.vue"),
                    },
                    {
                        path: ":id/edit",
                        name: "admin.menus.edit",
                        component: () =>
                            import("../views/admin/menus/edit.vue"),
                    },
                ],
            },
            {
                path: "profile",
                name: "admin.profile",
                component: () => import("../views/admin/profile/index.vue"),
            },
            {
                path: "settings",
                name: "admin.settings.index",
                component: () => import("../views/admin/settings/index.vue"),
            },
        ],
    },
    {
        path: "/portal",
        component: () => import("../components/layout/AdminLayout.vue"),
        meta: { requiresAuth: true },
        children: [
            {
                path: "dashboard",
                name: "portal.dashboard",
                component: () => import("../views/admin/dashboard/index.vue"),
            },
            {
                path: "profile",
                name: "portal.profile",
                component: () => import("../views/admin/profile/index.vue"),
            },
            {
                path: "settings",
                name: "portal.settings.index",
                component: () => import("../views/admin/settings/index.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Setup global navigation guards
setupGuards(router);

export default router;
