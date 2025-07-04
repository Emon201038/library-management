import { z } from "zod"

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  author: z.string().min(1, "Author is required").max(100, "Author must be less than 100 characters"),
  genre: z.string().min(1, "Genre is required"),
  isbn: z
    .string()
    .min(1, "ISBN is required")
  //   .regex(
  //     /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
  //     "Please enter a valid ISBN",
  // )
  ,
  description: z.string().optional(),
  publisher: z.string().optional(),
  publishedYear: z
    .number()
    .min(1000, "Published year must be at least 1000")
    .max(new Date().getFullYear(), `Published year cannot be in the future`)
    .optional(),
  language: z.string().min(1, "Language is required"),
  pages: z.number().min(1, "Pages must be at least 1").optional(),
  copies: z.number().min(1, "Total copies must be at least 1"),
  price: z.string().optional(),
  available: z.boolean().default(true).optional(),
  image: z.string().optional().refine(
    (val) =>
      !val || /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)$/.test(val),
    {
      message: "Please enter a valid image URL. For example: https://example.com/image.jpg",
    }
  ),
})

export type BookFormData = z.infer<typeof bookSchema>
