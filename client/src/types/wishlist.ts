import type { TBook } from "./book"

export type WishlistBook = TBook & {
  dateAdded: string
  priority: "high" | "medium" | "low"
  notes?: string
}

export type WishlistData = WishlistBook[]
