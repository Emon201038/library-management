import type { IBorrowSummaryApiResponse } from "@/types/borrow";
import { apiSlice } from "../api/apiSlice";
import type { BorrowFormData } from "@/lib/validations/borrow";
import { booksApi } from "../books/booksApi";

export const borrowApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    borrowBook: builder.mutation<{ message: string, success: boolean }, BorrowFormData>({
      query: (data) => ({
        url: `/borrow`,
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        const patchResult1 = dispatch(booksApi.util.updateQueryData("getBooks", { page: "1", limit: "12", search: "", filter: "all" }, (draft) => {
          const index = draft.data.books.findIndex((b) => b._id === arg.book);
          if (index !== -1) {
            draft.data.books[index].copies -= arg.quantity;
            if (draft.data.books[index].copies < 0) draft.data.books[index].available = false
          }
          return draft
        }));
        const patchResult2 = dispatch(booksApi.util.updateQueryData("getBook", arg.book, (draft) => {
          draft.data.copies -= arg.quantity;
          if (draft.data.copies <= 0) draft.data.available = false
        }))
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          patchResult1.undo();
          patchResult2.undo();
        }
      }
    }),
    getBorroweSummary: builder.query<IBorrowSummaryApiResponse, string>({
      query: (params) => ({
        url: `/borrow?page=1&limit=12&${params}`,
        method: "GET",
      })
    }),
    getSingleBorrowBook: builder.query({
      query: (id) => ({
        url: `/borrow/${id}`,
        method: "GET",
      }),
    }),
    updateBorrowBook: builder.mutation({
      query: ({ id, data }) => ({
        url: `/borrow/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteBorrowBook: builder.mutation<{ message: string, success: boolean }, string>({
      query: (id) => ({
        url: `/borrow/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useBorrowBookMutation,
  useGetBorroweSummaryQuery,
  useGetSingleBorrowBookQuery,
  useUpdateBorrowBookMutation,
  useDeleteBorrowBookMutation
} = borrowApi