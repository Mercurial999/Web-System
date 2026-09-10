import { z } from "zod";

export const createDeliverySchema = z.object({
  orderId: z.number().int().positive(),
  deliveryDate: z.coerce.date(),
  notes: z.string().optional(),
});