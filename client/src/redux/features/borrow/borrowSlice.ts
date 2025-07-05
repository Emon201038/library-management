import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface IBorrowState {
  filter: "all" | "high" | "medium" | "low",
  sortBy: "title" | "quantity",
  sortOrder: "asc" | "desc",
  search: string
}
const initialState: IBorrowState = {
  filter: "all",
  sortBy: "quantity",
  sortOrder: "desc",
  search: ""
};

export const borrowSlice = createSlice({
  name: "borrow",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<"all" | "high" | "medium" | "low">) => { state.filter = action.payload; },
    setSortBy: (state, action: PayloadAction<"title" | "quantity">) => { state.sortBy = action.payload; },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => { state.sortOrder = action.payload; },
    setSearch: (state, action: PayloadAction<string>) => { state.search = action.payload; }
  }
});

export const { setFilter, setSortBy, setSortOrder, setSearch } = borrowSlice.actions;
export default borrowSlice.reducer;