export interface Role {
    id: number;
    name: string;
    description: string;
    permissions: string[];
}

export interface MenuItem {
    id: number;
    label: string;
    path: string;
    icon: string;
    order: number;
    parent_id?: number;
}

export interface SiteSettings {
    siteName: string;
    siteUrl: string;
    maintenanceMode: boolean;
    description: string;
    twoFactorEnabled: boolean;
    sessionTimeout: string;
    recaptchaEnabled: boolean;
    recaptchaSiteKey: string;
    recaptchaSecretKey: string;
    analyticsId: string;
}
