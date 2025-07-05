import { BorrowSummaryPage } from "@/components/pages/borrow-summary";
import { CreateBookForm } from "@/components/pages/create-book";
import Home from "@/components/pages/home";
import { BookDetail } from "@/components/pages/single-book";
import { WishlistPage } from "@/components/pages/wishlist";
import MainLayout from "@/layout/main-layout";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "books",
        Component: Home,
      },
      {
        path: "books/:id",
        Component: BookDetail,
      },
      {
        path: "create-book",
        Component: CreateBookForm
      },
      {
        path: "borrow-summary",
        Component: BorrowSummaryPage
      },
      {
        path: "wishlist",
        Component: WishlistPage
      }
    ],
  },
]);
