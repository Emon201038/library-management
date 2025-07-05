export interface IBorrow<Book = string> {
  _id: string;
  book: Book;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface IBorrowSummary {
  book: {
    title: string;
    image: string | null;
    isbn: number | string;
  }
  totalQuantity: number;
}

export type IBorrowSummaryApiResponse = {
  success: boolean;
  message: string;
  data: IBorrowSummary[];
};