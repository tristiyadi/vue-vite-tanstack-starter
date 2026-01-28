import type { Role, MenuItem, SiteSettings } from "./types";

export const MockRoles: Role[] = [
    {
        id: 1,
        name: "Administrator",
        description: "Full access to all system features.",
        permissions: ["*"],
    },
    {
        id: 2,
        name: "Editor",
        description: "Can manage content but not system settings.",
        permissions: ["content.manage"],
    },
    {
        id: 3,
        name: "User",
        description: "Standard access to public features.",
        permissions: ["view.dashboard"],
    },
];

export const MockMenus: MenuItem[] = [
    {
        id: 1,
        label: "Dashboard",
        path: "/admin",
        icon: "LayoutDashboard",
        order: 1,
    },
    {
        id: 2,
        label: "Users",
        path: "/admin/users",
        icon: "Users",
        order: 2,
    },
    {
        id: 3,
        label: "Roles",
        path: "/admin/roles",
        icon: "ShieldCheck",
        order: 3,
    },
    {
        id: 4,
        label: "Menus",
        path: "/admin/menus",
        icon: "List",
        order: 4,
    },
    {
        id: 5,
        label: "Settings",
        path: "/admin/settings",
        icon: "Settings",
        order: 5,
    },
];

export const MockSettings: SiteSettings = {
    siteName: "Admin",
    siteUrl: "http://localhost:5173",
    maintenanceMode: false,
    description: "Premium enterprise starter kit.",
    twoFactorEnabled: false,
    sessionTimeout: "60",
    recaptchaEnabled: true,
    recaptchaSiteKey: "mock_site_key",
    recaptchaSecretKey: "mock_secret_key",
    analyticsId: "G-XXXXXXXXXX",
};
