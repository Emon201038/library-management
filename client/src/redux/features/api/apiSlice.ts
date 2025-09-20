import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://library-management-backend-steel.vercel.app/api",
  }),

  endpoints: () => ({}),
});
