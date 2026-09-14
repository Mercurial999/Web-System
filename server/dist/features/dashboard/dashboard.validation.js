import { z } from "zod";
export const dashboardOrdersQuerySchema = z.object({
    status: z
        .enum([
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
    ])
        .optional(),
    customerId: z.coerce
        .number()
        .int()
        .positive()
        .optional(),
    from: z
        .string()
        .date()
        .optional(),
    to: z
        .string()
        .date()
        .optional(),
    limit: z.coerce
        .number()
        .int()
        .positive()
        .max(100)
        .optional(),
});
export const dashboardDeliveriesQuerySchema = z.object({
    status: z
        .enum([
        "DRAFT",
        "COMPLETED",
        "CANCELLED",
    ])
        .optional(),
    customerId: z.coerce
        .number()
        .int()
        .positive()
        .optional(),
    from: z
        .string()
        .date()
        .optional(),
    to: z
        .string()
        .date()
        .optional(),
    limit: z.coerce
        .number()
        .int()
        .positive()
        .max(100)
        .optional(),
});
