"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookSchema, type BookFormData } from "@/lib/validations/book"
import { toast } from "sonner"
import type { z } from "zod"
import { useAddBookMutation } from "@/redux/features/books/booksApi"
import { useNavigate } from "react-router"
import BookForm from "../book-form"


export function CreateBookForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addBook] = useAddBookMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      description: "",
      publisher: "",
      publishedYear: new Date().getFullYear(),
      language: "English",
      pages: undefined,
      copies: 1,
      price: "",
      available: true,
    },
  })

  const onSubmit = async (data: BookFormData) => {
    setIsSubmitting(true)

    try {

      await addBook(data).unwrap()

      toast.success("Book created successfully!", {
        description: `"${data.title}" has been added to your library.`,
      });
      form.reset();
      // return redirect(`/#books-list`)
      navigate(`/#books-list`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Failed to create book", {
        description: error?.data?.message || error?.error || error,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookForm onSubmit={onSubmit} onClose={handleCancel} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
