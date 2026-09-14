import { z } from "zod";
export const createProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Product name is required."),
    description: z
        .string()
        .trim()
        .optional(),
    unit: z
        .string()
        .trim()
        .min(1, "Unit is required."),
    price: z
        .number()
        .positive("Price must be greater than zero."),
});
export const updateProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Product name cannot be empty.")
        .optional(),
    description: z
        .string()
        .trim()
        .optional(),
    unit: z
        .string()
        .trim()
        .min(1, "Unit cannot be empty.")
        .optional(),
    price: z
        .number()
        .positive("Price must be greater than zero.")
        .optional(),
    status: z
        .enum(["ACTIVE", "INACTIVE"])
        .optional(),
});
export const productQuerySchema = z.object({
    status: z
        .enum(["ACTIVE", "INACTIVE"])
        .optional(),
});
