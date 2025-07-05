import type { TBook } from "@/types/book";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
  selectedBook: TBook | null,
  openEditModal: boolean,
  openBorrowModal: boolean,
  wishlist: TBook[],
  page: number,
  limit: number,
  filter: string,
  search: string
};

const localStorageWishlist = localStorage.getItem("wishlist");
const parsedWishlist: TBook[] = localStorageWishlist ? JSON.parse(localStorageWishlist) : [];

const initialState: IInitialState = {
  selectedBook: null,
  wishlist: parsedWishlist,
  openEditModal: false,
  openBorrowModal: false,
  page: 1,
  limit: 12,
  filter: "all",
  search: ""
}

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setSelectedBook: (state, action: PayloadAction<TBook | null>) => { state.selectedBook = action.payload; },
    toggleWishlist: (state, action: PayloadAction<TBook>) => {
      if (state.wishlist.some(b => b._id === action.payload._id)) {
        const updatedState = state.wishlist.filter((book) => book._id !== action.payload._id)
        state.wishlist = updatedState;
        localStorage.setItem("wishlist", JSON.stringify(updatedState));
      }
      else {
        state.wishlist.push(action.payload);
        localStorage.setItem("wishlist", JSON.stringify([...state.wishlist, action.payload]));
      }
    },
    setOpenEditModal: (state, action: PayloadAction<boolean>) => { state.openEditModal = action.payload; },
    setOpenBorrowModal: (state, action: PayloadAction<boolean>) => { state.openBorrowModal = action.payload; },
    setPage: (state, action: PayloadAction<number>) => { state.page = action.payload; },
    setLimit: (state, action: PayloadAction<number>) => { state.limit = action.payload; },
    setFilter: (state, action: PayloadAction<string>) => { state.filter = action.payload; },
    setSearch: (state, action: PayloadAction<string>) => { state.search = action.payload; }
  }
});

export const { setSelectedBook, toggleWishlist, setOpenEditModal, setOpenBorrowModal, setPage, setLimit, setFilter, setSearch } = bookSlice.actions;
export default bookSlice.reducer;