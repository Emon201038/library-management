import type { TBook, TBookApiResponse, TBooksApiResponse } from "@/types/book";
import { apiSlice } from "../api/apiSlice";

const normalizeKey = (params: URLSearchParams) => {
  const parsed = new URLSearchParams(params);
  const page = parsed.get("page") || 1;
  const limit = parsed.get("limit") || 12;
  const search = parsed.get("search") || "";
  const filter = parsed.get("filter") || "";
  return `page=${page}&limit=${limit}&search=${search}&filter=${filter}`;
};


export const booksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<TBooksApiResponse, URLSearchParams>({
      query: (params) => {
        console.log(params, "args")
        const normalizedParams = normalizeKey(params);
        return {
          url: `/books?${normalizedParams}`,
          method: "GET",
        }
      },
    }),
    getMoreBooks: builder.query<TBooksApiResponse, URLSearchParams>({
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
              booksApi.util.updateQueryData("getBooks", arg, (draft) => {
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
    addBook: builder.mutation<TBookApiResponse, unknown>({
      query: (data) => ({
        url: "/books",
        method: "POST",
        body: data,
      }),

      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        const id = Math.random().toString();
        const patchResult = dispatch(booksApi.util.updateQueryData("getBooks", new URLSearchParams({ page: "1", limit: "12", search: "", filter: "" }), (draft) => {
          const newBook = { ...arg as TBook, _id: id };

          draft.data.books = [newBook, ...draft.data.books];
        }))

        try {
          const response = await queryFulfilled;
          dispatch(booksApi.util.updateQueryData("getBooks", new URLSearchParams(), (draft) => {
            const book = draft.data.books.find((book) => book._id == id);

            if (book) {
              const index = draft.data.books.findIndex((b) => b._id === id);
              if (index !== -1) {
                draft.data.books[index] = {
                  ...response.data.data,
                };
              }
            }
            console.log(JSON.stringify(book), "added book pessimistic");
            return draft
          }))
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      }
    }),
    updateBook: builder.mutation({
      query: ({ id, data }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteBook: builder.mutation<{ message: string; success: boolean }, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { queryFulfilled, dispatch }) => {
        const patchResult = dispatch(booksApi.util.updateQueryData("getBooks", new URLSearchParams({ page: "1", limit: "12", search: "", filter: "" }), (draft) => {
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