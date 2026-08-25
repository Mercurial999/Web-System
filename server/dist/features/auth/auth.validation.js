import { z } from "zod";
export const loginSchema = z.object({
    email: z
        .email("Please enter a valid email address.")
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),
});
export const forgotPasswordSchema = z.object({
    email: z
        .email("Please enter a valid email address.")
        .trim()
        .toLowerCase(),
});
export const resetPasswordSchema = z.object({
    token: z
        .string()
        .min(1, "Reset token is required."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),
});
export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(8, "Current password is required."),
    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters."),
});
