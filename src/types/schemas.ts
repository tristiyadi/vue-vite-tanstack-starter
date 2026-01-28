import { z } from "zod";

// --- User Schemas ---
export const UserCreateSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    });

export const UserEditSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .optional()
            .or(z.literal("")),
        password_confirmation: z.string().optional().or(z.literal("")),
    })
    .refine(
        (data) => {
            if (data.password) {
                return data.password === data.password_confirmation;
            }
            return true;
        },
        {
            message: "Passwords do not match",
            path: ["password_confirmation"],
        },
    );

// --- Role Schemas ---
export const RoleSchema = z.object({
    name: z.string().min(3, "Role name must be at least 3 characters"),
    description: z.string().min(1, "Description is required"),
    permissions: z.array(z.string()).optional(),
});

// --- Menu Schemas ---
export const MenuSchema = z.object({
    label: z.string().min(2, "Label must be at least 2 characters"),
    path: z.string().startsWith("/", "Path must start with /"),
    icon: z.string().optional(),
    order: z.number().int().min(0, "Order must be a positive integer"),
});

// --- Auth Schemas ---
export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});
