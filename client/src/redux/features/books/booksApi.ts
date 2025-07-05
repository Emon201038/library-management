import type { TBook, TBookApiResponse, TBooksApiResponse } from "@/types/book";
import { apiSlice } from "../api/apiSlice";
import type { BookFormData } from "@/lib/validations/book";

type TQueryParams =
  {
    page: string;
    limit: string;
    search: string;
    filter: string;
  }

const normalizeKey = (params: TQueryParams) => {
  const page = params.page || "1";
  const limit = params.limit || "12";
  const search = params.search || "";
  const filter = params.filter || "";
  return `page=${page}&limit=${limit}&search=${search}&filter=${filter}`;
};


export const booksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<TBooksApiResponse, TQueryParams>({
      query: (params) => {
        const normalizedParams = normalizeKey(params);
        return {
          url: `/books?${normalizedParams}`,
          method: "GET",
        }
      },
    }),
    getMoreBooks: builder.query<TBooksApiResponse, TQueryParams>({
      query: (params) => {
        const normalizedParams = normalizeKey(params);
        return {
          url: `/books?${normalizedParams}`,
          method: "GET",
        }
      },

      //optimistic updates for infinite scroll
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const result = await queryFulfilled;
          if (result.data.data.books.length > 0) {
            dispatch(
              booksApi.util.updateQueryData("getBooks", { page: "1", limit: "12", search: arg.search, filter: arg.filter }, (draft) => {
                const incomingBooks = result.data.data.books;

                // Optional: dedup
                const existingIds = new Set(draft.data.books.map((b) => b._id));
                const newBooks = incomingBooks.filter((b) => !existingIds.has(b._id));

                draft.data.books.push(...newBooks);
                draft.data.pagination = result.data.data.pagination;
              })
            );
          }
        } catch (error) {
          console.error(error)
        }
      }
    }),
    getBook: builder.query<TBookApiResponse, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: "GET",
      }),
    }),
    addBook: builder.mutation<TBookApiResponse, BookFormData>({
      query: (data) => ({
        url: "/books",
        method: "POST",
        body: data,
      }),

      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        const id = Math.random().toString();
        const patchResult = dispatch(booksApi.util.updateQueryData("getBooks", { page: "1", limit: "12", search: "", filter: "all" }, (draft) => {
          const newBook = { ...arg as TBook, _id: id };

          draft.data.books = [newBook, ...draft.data.books];
        }))

        try {
          const response = await queryFulfilled;
          dispatch(booksApi.util.updateQueryData("getBooks", { page: "1", limit: "12", search: "", filter: "all" }, (draft) => {
            const book = draft.data.books.find((book) => book._id == id);

            if (book) {
              const index = draft.data.books.findIndex((b) => b._id === id);
              if (index !== -1) {
                draft.data.books[index] = {
                  ...response.data.data,
                };
              }
            }
            return draft
          }))
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      }
    }),
    updateBook: builder.mutation<TBookApiResponse, { formData: BookFormData, id: string }>({
      query: ({ id, formData }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: formData,
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        const patchResult = dispatch(booksApi.util.updateQueryData("getBooks", { page: "1", limit: "12", search: "", filter: "all" }, (draft) => {
          const index = draft.data.books.findIndex((b) => b._id === arg.id);
          if (index !== -1) {
            draft.data.books[index] = {
              ...draft.data.books[index],
              ...arg.formData,
            };
          }
        }));
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      }
    }),
    deleteBook: builder.mutation<{ message: string; success: boolean }, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { queryFulfilled, dispatch }) => {
        const patchResult = dispatch(booksApi.util.updateQueryData("getBooks", { page: "1", limit: "12", search: "", filter: "all" }, (draft) => {
          const index = draft.data.books.findIndex((b) => b._id === id);
          if (index !== -1) {
            draft.data.books.splice(index, 1);
          }
        }));
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      }
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetMoreBooksQuery,
  useLazyGetMoreBooksQuery,
  useGetBookQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;