import { z } from "zod";
export const createUserSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required.")
        .max(100, "First name is too long."),
    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required.")
        .max(100, "Last name is too long."),
    email: z
        .email("Please enter a valid email address.")
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),
    roleId: z
        .number()
        .int()
        .positive("Role ID must be a positive number."),
});
export const updateUserSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters.")
        .optional(),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters.")
        .optional(),
    email: z
        .email("Please enter a valid email address.")
        .trim()
        .toLowerCase()
        .optional(),
    phone: z
        .string()
        .optional()
        .nullable(),
    roleId: z
        .number()
        .int()
        .positive()
        .optional(),
    status: z
        .enum(["ACTIVE", "INACTIVE"])
        .optional(),
});
