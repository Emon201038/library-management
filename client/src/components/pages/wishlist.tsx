import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Heart,
  Star,
  Calendar,
  Edit3,
  Trash2,
  ShoppingCart,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import type { WishlistBook } from "@/types/wishlist"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { removeFromWishlist, updateWishlistBook } from "@/redux/features/books/bookSlice"
import { toast } from "sonner"


export function WishlistPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "author" | "dateAdded" | "priority">("dateAdded")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterBy, setFilterBy] = useState<"all" | "available" | "unavailable">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [selectedBook, setSelectedBook] = useState<WishlistBook | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { wishlist: wishlistData } = useAppSelector((state) => state.books)

  const dispatch = useAppDispatch()


  // Filter and sort data
  const filteredAndSortedData = wishlistData
    .filter((item) => {
      // Search filter
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.isbn.toString().includes(searchTerm) ||
        item.genre.toLowerCase().includes(searchTerm.toLowerCase())

      // available filter
      let matchesavailable = true
      if (filterBy === "available") matchesavailable = item.available && item.copies > 0
      else if (filterBy === "unavailable") matchesavailable = !item.available || item.copies === 0

      // Priority filter
      let matchesPriority = true
      if (priorityFilter !== "all") matchesPriority = item.priority === priorityFilter

      return matchesSearch && matchesavailable && matchesPriority
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === "title") comparison = a.title.localeCompare(b.title)
      else if (sortBy === "author") comparison = a.author.localeCompare(b.author)
      else if (sortBy === "dateAdded") comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const removeFromWishlistHandler = (bookId: string) => {
    dispatch(removeFromWishlist(bookId))
  }

  const updateBookNotes = (bookId: string, notes: string, priority: "high" | "medium" | "low") => {
    const book = wishlistData.find((book) => book._id === bookId);
    if (!book) return;
    dispatch(updateWishlistBook({ ...book, notes, priority }));
  }

  const getPriorityIcon = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500"
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-400 dark:to-yellow-500"
      case "low":
        return "bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500"
    }
  }

  // Calculate statistics
  const totalBooks = wishlistData.length
  const availableBooks = wishlistData.filter((book) => book.available && book.copies > 0).length
  const highPriorityBooks = wishlistData.filter((book) => book.priority === "high").length
  const averageRating = wishlistData.reduce((sum, book) => sum + (book.rating || 0), 0) / totalBooks || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20 dark:from-gray-900 dark:via-pink-900/20 dark:to-purple-900/20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-pink-800 to-purple-800 dark:from-gray-100 dark:via-pink-200 dark:to-purple-200 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 rounded-lg">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  My Wishlist
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Books you want to read and borrow</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Total Books</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 dark:from-pink-400 dark:to-pink-600 bg-clip-text text-transparent">
                    {totalBooks}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-400 dark:to-pink-500 rounded-full">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Available Now</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {availableBooks}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">High Priority</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
                    {highPriorityBooks}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 rounded-full">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Avg. Rating</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                    {averageRating.toFixed(1)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search by title, author, genre, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus:border-pink-400 dark:focus:border-pink-500 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              <div className="flex gap-2 items-center">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Select value={filterBy} onValueChange={(value: "all" | "available" | "unavailable") => setFilterBy(value)}>
                  <SelectTrigger className="w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem
                      value="all"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      All Books
                    </SelectItem>
                    <SelectItem
                      value="available"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Available
                    </SelectItem>
                    <SelectItem
                      value="unavailable"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Unavailable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 items-center">
                <Select value={priorityFilter} onValueChange={(value: "all" | "high" | "medium" | "low") => setPriorityFilter(value)}>
                  <SelectTrigger className="w-32 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem
                      value="all"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      All Priority
                    </SelectItem>
                    <SelectItem
                      value="high"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      High Priority
                    </SelectItem>
                    <SelectItem
                      value="medium"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Medium Priority
                    </SelectItem>
                    <SelectItem
                      value="low"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Low Priority
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 items-center">
                <Select value={sortBy} onValueChange={(value: "dateAdded" | "title" | "author" | "priority") => setSortBy(value)}>
                  <SelectTrigger className="w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem
                      value="dateAdded"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Date Added
                    </SelectItem>
                    <SelectItem
                      value="title"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Title
                    </SelectItem>
                    <SelectItem
                      value="author"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Author
                    </SelectItem>
                    <SelectItem
                      value="priority"
                      className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      Priority
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Books Grid */}
        {filteredAndSortedData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedData.map((book) => (
              <Card
                key={book._id}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl hover:shadow-2xl dark:hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-pink-800 dark:via-purple-800 dark:to-blue-800 flex items-center justify-center relative">
                        {book.image ? (
                          <img
                            src={book.image || "/placeholder.svg"}
                            alt={book.title}
                            width={96}
                            height={128}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.nextElementSibling?.classList.remove("hidden")
                              target.nextElementSibling?.classList.add("flex")
                            }}
                          />
                        ) : (
                          <BookOpen className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                        )}
                        {book.image && (
                          <div className="hidden w-full h-full items-center justify-center">
                            <BookOpen className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}

                        {/* Priority Badge */}
                        <div className="absolute top-2 left-2">
                          <div className={`p-1 rounded-full ${getPriorityColor(book.priority)}`}>
                            {getPriorityIcon(book.priority)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 leading-tight">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {book.author}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlistHandler(book._id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {book.genre}
                        </Badge>
                        <Badge
                          variant={book.available && book.copies > 0 ? "default" : "destructive"}
                          className={
                            book.available && book.copies > 0
                              ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                              : ""
                          }
                        >
                          {book.available && book.copies > 0 ? "Available" : "Unavailable"}
                        </Badge>
                      </div>

                      {book.rating && (
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">{book.rating}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({book.reviewCount?.toLocaleString()})
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Added {new Date(book.dateAdded).toLocaleDateString()}
                        </div>
                        {book.price && (
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{book.price}</div>
                        )}
                      </div>

                      {book.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 italic">
                          "{book.notes}"
                        </p>
                      )}

                      <div className="flex gap-2">
                        {book.available && book.copies > 0 ? (
                          <Button
                            size="sm"
                            onClick={() => toast.info("Borrowing feature is coming soon...")}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Borrow
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled className="flex-1 bg-transparent">
                            Unavailable
                          </Button>
                        )}
                        <Dialog
                          open={isEditModalOpen && selectedBook?._id === book._id}
                          onOpenChange={setIsEditModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBook(book)}
                              className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-gray-900 dark:text-gray-100">Edit Wishlist Item</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">
                                  Priority
                                </Label>
                                <Select
                                  value={selectedBook?.priority}
                                  onValueChange={(value: "high" | "medium" | "low") =>
                                    setSelectedBook((prev) => (prev ? { ...prev, priority: value } : null))
                                  }
                                >
                                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <SelectItem value="high" className="text-gray-900 dark:text-gray-100">
                                      High Priority
                                    </SelectItem>
                                    <SelectItem value="medium" className="text-gray-900 dark:text-gray-100">
                                      Medium Priority
                                    </SelectItem>
                                    <SelectItem value="low" className="text-gray-900 dark:text-gray-100">
                                      Low Priority
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">
                                  Notes
                                </Label>
                                <Textarea
                                  id="notes"
                                  value={selectedBook?.notes || ""}
                                  onChange={(e) =>
                                    setSelectedBook((prev) => (prev ? { ...prev, notes: e.target.value } : null))
                                  }
                                  placeholder="Add your notes about this book..."
                                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    if (selectedBook) {
                                      updateBookNotes(selectedBook._id, selectedBook.notes || "", selectedBook.priority)
                                      setIsEditModalOpen(false)
                                    }
                                  }}
                                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm || filterBy !== "all" || priorityFilter !== "all"
                  ? "No Books Found"
                  : "Your Wishlist is Empty"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterBy !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start adding books you want to read to your wishlist."}
              </p>
              {!searchTerm && filterBy === "all" && priorityFilter === "all" && (
                <Button className="mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Books
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        {filteredAndSortedData.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedData.length} of {wishlistData.length} books
            {searchTerm && ` matching "${searchTerm}"`}
            {filterBy !== "all" && ` that are ${filterBy}`}
            {priorityFilter !== "all" && ` with ${priorityFilter} priority`}
          </div>
        )}
      </div>
    </div>
  )
}
