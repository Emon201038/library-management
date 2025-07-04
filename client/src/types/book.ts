export type TBook = {
  _id: string
  title: string
  author: string
  genre: string
  isbn: string
  description?: string
  copies: number
  available: boolean
  publishedYear?: number
  publisher?: string
  pages?: number
  language?: string
  rating?: number
  reviewCount?: number
  price?: string
  image?: string
}

export type BorrowFormData = {
  borrowerName: string
  borrowerEmail: string
  returnDate: string
}

export type BookFormData = Omit<TBook, "_id"> & {
  availability?: boolean
}

export type BorrowRecord = {
  id: string
  bookId: string
  bookTitle: string
  isbn: string
  borrowerName: string
  borrowerEmail: string
  borrowDate: string
  returnDate: string
  status: "borrowed" | "returned"
}

export type BorrowSummary = {
  bookId: string
  bookTitle: string
  isbn: string
  totalQuantityBorrowed: number
}

export type Review = {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  helpful: number
};

export type TPagination = {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  prevPage: number
  nextPage: number
}

export type TBooksApiResponse = {
  success: boolean
  message: string
  data: {
    books: TBook[]
    pagination: TPagination
  }
}

export type TBookApiResponse = {
  success: boolean
  message: string
  data: TBook
}