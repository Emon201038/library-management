import { z } from "zod"

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  author: z.string().min(1, "Author is required").max(100, "Author must be less than 100 characters"),
  genre: z.string().min(1, "Genre is required"),
  isbn: z
    .number()
    .min(1, "ISBN is required")
  //   .regex(
  //     /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
  //     "Please enter a valid ISBN",
  // )
  ,
  description: z.string().optional(),
  publisher: z.string().optional(),
  publishedYear: z
    .number().optional().refine(
      (val) =>
        !val || val >= 1000 && val <= new Date().getFullYear(),
      {
        message: "Please enter a valid published year",
      })
  ,
  language: z.string().optional(),
  pages: z.number().optional(),
  copies: z.number().optional(),
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
