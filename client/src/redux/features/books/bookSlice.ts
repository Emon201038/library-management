import type { TBook } from "@/types/book";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
  selectedBook: TBook | null,
  wishlist: string[]
}
const initialState: IInitialState = {
  selectedBook: null,
  wishlist: [],
}
const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setSelectedBook: (state, action: PayloadAction<TBook | null>) => { state.selectedBook = action.payload; },
    addToWishlist: (state, action: PayloadAction<string>) => { state.wishlist.push(action.payload) },
    removeFromWishlist: (state, action: PayloadAction<string>) => { state.wishlist = state.wishlist.filter((bookId) => bookId !== action.payload) },
  }
});

export const { setSelectedBook, addToWishlist, removeFromWishlist } = bookSlice.actions;
export default bookSlice.reducer;