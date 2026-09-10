import { z } from "zod";

export const createOrderSchema = z.object({
  customerId: z.number().int().positive(),
  orderDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Order must contain at least one item"),
});

export const addOrderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const updateOrderItemSchema = z.object({
  quantity: z.number().int().positive(),
});

export const updateOrderSchema = z
  .object({
    customerId: z.number().int().positive().optional(),
    orderDate: z.coerce.date().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) =>
      data.customerId !== undefined ||
      data.orderDate !== undefined ||
      data.notes !== undefined,
    {
      message: "At least one field must be provided for update",
    },
  );