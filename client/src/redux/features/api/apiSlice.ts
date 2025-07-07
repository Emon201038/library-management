import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://library-management-7lmv.onrender.com/api' }),

  endpoints: () => ({}),
});
