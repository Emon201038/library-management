import { z } from "zod";

export const borrowSchema = z.object({
  book: z.string().min(1, "Book is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  dueDate: z.date().min(new Date(), "Due date must be in the future"),
});

export type BorrowFormData = z.infer<typeof borrowSchema>;