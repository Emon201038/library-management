import type { TBook } from "@/types/book";
import type { WishlistBook } from "@/types/wishlist";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
  selectedBook: TBook | null,
  openEditModal: boolean,
  openBorrowModal: boolean,
  wishlist: WishlistBook[],
  page: number,
  limit: number,
  filter: string,
  search: string
};

const localStorageWishlist = localStorage.getItem("wishlist");
const parsedWishlist: WishlistBook[] = localStorageWishlist ? JSON.parse(localStorageWishlist) : [];

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
        state.wishlist.push({ ...action.payload, _id: action.payload._id, dateAdded: new Date().toISOString(), priority: "medium" });
        localStorage.setItem("wishlist", JSON.stringify([...state.wishlist, action.payload]));
      }
    },

    updateWishlistBook: (state, action: PayloadAction<WishlistBook>) => {
      state.wishlist = state.wishlist.map((book) => (
        book._id === action.payload._id ? action.payload : book)
      )
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter((book) => book._id !== action.payload);
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },

    setOpenEditModal: (state, action: PayloadAction<boolean>) => { state.openEditModal = action.payload; },

    setOpenBorrowModal: (state, action: PayloadAction<boolean>) => { state.openBorrowModal = action.payload; },

    setPage: (state, action: PayloadAction<number>) => { state.page = action.payload; },

    setLimit: (state, action: PayloadAction<number>) => { state.limit = action.payload; },

    setFilter: (state, action: PayloadAction<string>) => { state.filter = action.payload; },

    setSearch: (state, action: PayloadAction<string>) => { state.search = action.payload; }
  }
});

export const { setSelectedBook, toggleWishlist, setOpenEditModal, setOpenBorrowModal, setPage, setLimit, setFilter, setSearch, removeFromWishlist, updateWishlistBook } = bookSlice.actions;
export default bookSlice.reducer;