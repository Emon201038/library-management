import { booksApi, useDeleteBookMutation, useGetBooksQuery } from "@/redux/features/books/booksApi";
import { useEffect, useState, type ReactNode, type SetStateAction } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "./ui/card";
import { BookOpen, BookOpenCheckIcon, EditIcon, Heart, MoreVerticalIcon, Star, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { setOpenBorrowModal, setOpenEditModal, setPage, setSelectedBook, toggleWishlist } from "@/redux/features/books/bookSlice";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";
import type { TBook } from "@/types/book";

const BookList = () => {
  const [hasMore, setHasMore] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState("");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { wishlist, page, limit, search, filter } = useAppSelector(state => state.books);

  const query = {
    page: page.toString(),
    limit: limit.toString(),
    search,
    filter
  }
  const { data, isLoading, isError, error } = useGetBooksQuery(query,
    {
      refetchOnReconnect: true,
      skipPollingIfUnfocused: true,
      // refetchOnMountOrArgChange: true,
      pollingInterval: 180000
    });

  useEffect(() => {
    if (data?.data?.pagination?.page) {
      dispatch(setPage(Number(data?.data?.pagination?.page)))

    };
    setHasMore(!!data?.data?.pagination?.nextPage)
  }, [data?.data, dispatch]);

  const loadMoreBooks = async () => {
    if (hasMore) {
      const newParams = {
        page: (page + 1).toString(),
        limit: limit.toString(),
        search,
        filter
      };


      await dispatch(booksApi.endpoints.getMoreBooks.initiate(newParams, { forceRefetch: true })).unwrap();
    }
  };

  const toggleFavorite = (book: TBook) => {
    dispatch(toggleWishlist(book));
    if (wishlist.some(b => b._id === book._id)) {
      toast.success("Book removed from wishlist");
    } else {
      toast.success("Book added to wishlist");
    }
  }

  let content: ReactNode = null;
  if (isLoading) {
    content = <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-[500px] animate-pulse bg-slate-300"></div>
      ))}
    </div>
  };
  if (!isLoading && isError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorData = error as any
    content = <div className="text-red-500 text-[4vw] text-center py-6 font-semibold">
      {errorData?.error}
    </div>
  };
  if (!isLoading && !isError && data?.data?.books?.length === 0) {
    content = <div className="text-red-500 text-[5vw] text-center py-6 font-semibold">No books found</div>
  };
  if (!isLoading && !isError && data?.data?.books?.length && data?.data?.books?.length > 0) {

    content = (
      <div id="books-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.data.books.map((book) => (
          <Card id={book._id} key={book._id} className="group hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900 py-0">
            <CardContent className="p-0">
              {/* Book Cover Placeholder */}
              <div className="relative">
                {book?.image ? <img src={book?.image} alt={book?.title} className="w-full aspect-[3/4] object-cover" /> : <div className="relative aspect-[3/4] bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-t-lg flex items-center justify-center">
                  {/* Add subtle pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>}

                {/* Favorite Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(book)}
                  className="absolute top-2 right-12 bg-white/80 dark:bg-black/80 hover:bg-white"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 ",
                      {
                        "fill-red-500 stroke-red-500": wishlist.some(b => b._id === book._id),
                        "fill-none stroke-gray-600 dark:stroke-gray-300 text-gray-600 dark:text-gray-300": !wishlist.some(b => b._id === book._id),
                      })}
                  />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 dark:bg-black/80 hover:bg-white"
                    >
                      <MoreVerticalIcon
                        className={`h-4 w-4 text-gray-600 dark:text-gray-300`}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        dispatch(setSelectedBook(book));
                        dispatch(setOpenEditModal(true))
                      }}
                      className="cursor-pointer"
                    >
                      <EditIcon />
                      Edit Book
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      if (book.available && book.copies > 0) {
                        dispatch(setSelectedBook(book));
                        dispatch(setOpenBorrowModal(true))
                      } else {
                        toast.error("Book is not available for borrowing");
                      }
                    }}>
                      <BookOpenCheckIcon />
                      Borrow Book
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setIsDeleteModalOpen(true);
                      setDeleteBookId(book._id);
                    }} className="text-destructive cursor-pointer">
                      <Trash2Icon className="text-destructive" />
                      Delete Book
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* availableavailable Badge */}
                <div className="absolute top-2 left-2">
                  <Badge
                    variant={book.available && book.copies > 0 ? "default" : "destructive"}
                    className={
                      book.available && book.copies > 0
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : ""
                    }
                  >
                    {book.available && book.copies > 0 ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-4">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {book.genre.replace("_", " ")}
                  </Badge>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {book.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">by {book.author}</p>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{book.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    ({Math.floor(Math.random() * 1000 + 100)} reviews)
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{book.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {book.copies} copies available
                  </div>
                </div>

                <Button className="w-full mt-3 cursor-pointer" onClick={() => navigate(`/books/${book._id}`)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  };

  return (
    <>
      {/* Delete book confirmation modal */}
      <DeleteBookConfirmationModal id={deleteBookId} open={isDeleteModalOpen} setOpen={setIsDeleteModalOpen} />

      <div id="books-list">
        {content}
        {/* Load More Button */}
        {data?.data?.pagination?.nextPage && <div className="text-center mt-12">
          <Button onClick={loadMoreBooks} variant="outline" size="lg">
            Load More Books
          </Button>
        </div>}
      </div>
    </>
  )
}

const DeleteBookConfirmationModal = ({ id, open, setOpen }: { id: string, open: boolean, setOpen: React.Dispatch<SetStateAction<boolean>> }) => {

  const [deleteBook] = useDeleteBookMutation();

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id);
      setOpen(false);
      toast.success("Book deleted successfully!");
    } catch (err) {

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any
      toast.error("Failed to delete book", { description: error?.data?.message || error?.error || error })
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
          </DialogClose>
          <Button onClick={() => handleDeleteBook(id)} variant="destructive">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BookList