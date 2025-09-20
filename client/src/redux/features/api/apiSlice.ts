import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://librarybackend-psi.vercel.app/api",
  }),

  endpoints: () => ({}),
});
