
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, SortAsc, SortDesc, BarChart3, TrendingUp, Users } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setFilter, setSearch, setSortBy, setSortOrder } from "@/redux/features/borrow/borrowSlice"
import { useGetBorroweSummaryQuery } from "@/redux/features/borrow/borrowApi"
import { BorrowSummarySkeleton } from "../loading-borrow-summary"
import { useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"



export function BorrowSummaryPage() {
  const { search, sortBy, sortOrder, filter } = useAppSelector(state => state.borrow);
  const [inputValue, setInputValue] = useState("");

  const dispatch = useAppDispatch();

  const debouncedUpdateSearch = useDebounce((value: string) => dispatch(setSearch(value)), 500);

  const { data: borrowData, isLoading, isError, error } = useGetBorroweSummaryQuery(`sortBy=${sortBy}&sort=${sortOrder}&filter=${filter}&search=${search}`, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const data = borrowData?.data;

  if (isLoading) {
    return <BorrowSummarySkeleton />
  } else if (!isLoading && isError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any
    return <div className="py-20 text-center text-2xl text-destructive font-extrabold">Error: {err?.message || err?.data?.message || err?.error || err}</div>
  }
  else if (!isLoading && !isError && !data) {
    return <div className="py-20 text-center text-2xl font-extrabold">No data found</div>
  } else {
    // Filter and sort data
    const filteredAndSortedData = data
      ?.filter((item) => {
        // Search filter
        const matchesSearch =
          item.book.title.toLowerCase().includes(search.toLowerCase()) ||
          item.book.isbn.toString().includes(search)

        // Quantity filter
        let matchesFilter = true
        if (filter === "high") matchesFilter = item.totalQuantity >= 10
        else if (filter === "medium") matchesFilter = item.totalQuantity >= 5 && item.totalQuantity < 10
        else if (filter === "low") matchesFilter = item.totalQuantity < 5

        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        if (sortBy === "title") {
          const comparison = a.book.title.localeCompare(b.book.title)
          return sortOrder === "asc" ? comparison : -comparison
        } else {
          const comparison = a.totalQuantity - b.totalQuantity
          return sortOrder === "asc" ? comparison : -comparison
        }
      })

    // Calculate statistics
    const totalBorrowedBooks = (data || [])?.reduce((sum, item) => sum + item.totalQuantity, 0)
    const uniqueBooksCount = (data || [])?.length
    const averageBorrowsPerBook = uniqueBooksCount > 0 ? (totalBorrowedBooks / uniqueBooksCount).toFixed(1) : "0"
    const mostBorrowedBook = data?.reduce(
      (max, item) => (item.totalQuantity > max.totalQuantity ? item : max),
      data[0] || { totalQuantity: 0 },
    )

    const toggleSortOrder = () => {
      dispatch(setSortOrder(sortOrder === "asc" ? "desc" : "asc"))
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    Borrow Summary
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Overview of borrowed books and their quantities</p>
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
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Borrowed</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                      {totalBorrowedBooks}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Unique Books</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                      {uniqueBooksCount}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Average per Book</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                      {averageBorrowsPerBook}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-full">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Most Popular</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent truncate">
                      {mostBorrowedBook?.book?.title || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {mostBorrowedBook?.totalQuantity || 0} borrows
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 rounded-full">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Search by title or ISBN..."
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      debouncedUpdateSearch(e.target.value);
                    }}
                    className="pl-10 focus:border-blue-400 dark:focus:border-blue-500 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Select value={filter} onValueChange={(value: "all" | "high" | "medium" | "low") => dispatch(setFilter(value))}>
                    <SelectTrigger className="w-32 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
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
                        value="high"
                        className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        High (10+)
                      </SelectItem>
                      <SelectItem
                        value="medium"
                        className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        Medium (5-9)
                      </SelectItem>
                      <SelectItem
                        value="low"
                        className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        Low (&lt;5)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 items-center">
                  <Select value={sortBy} onValueChange={(value: "quantity" | "title") => dispatch(setSortBy(value))}>
                    <SelectTrigger className="w-32 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectItem
                        value="quantity"
                        className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        Quantity
                      </SelectItem>
                      <SelectItem
                        value="title"
                        className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        Title
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
          {(filteredAndSortedData || [])?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedData?.map((item, index) => (
                <Card
                  key={`${item.book.isbn}-${index}`}
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl hover:shadow-2xl dark:hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Book Cover */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-28 rounded-lg overflow-hidden bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 flex items-center justify-center">
                          {item.book.image ? (
                            <img
                              src={item.book.image || "/placeholder.svg"}
                              alt={item.book.title}
                              width={80}
                              height={112}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.nextElementSibling?.classList.remove("hidden")
                                target.nextElementSibling?.classList.add("flex")
                              }}
                            />
                          ) : (
                            <BookOpen className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                          )}
                          {item.book.image && (
                            <div className="hidden w-full h-full items-center justify-center">
                              <BookOpen className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-tight">
                          {item.book.title}
                        </h3>

                        <div className="mb-3">
                          <Badge
                            variant="secondary"
                            className="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                          >
                            ISBN: {item.book.isbn}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Borrowed</div>
                          <Badge
                            variant={
                              item.totalQuantity >= 10 ? "default" : item.totalQuantity >= 5 ? "secondary" : "outline"
                            }
                            className={`text-lg font-bold px-3 py-1 ${item.totalQuantity >= 10
                              ? "bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 text-white border-0"
                              : item.totalQuantity >= 5
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white border-0"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-400 dark:to-gray-500 text-white border-0"
                              }`}
                          >
                            {item.totalQuantity}
                          </Badge>
                        </div>

                        {/* Quantity indicator bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${item.totalQuantity >= 10
                                ? "bg-gradient-to-r from-green-400 to-green-500 dark:from-green-300 dark:to-green-400"
                                : item.totalQuantity >= 5
                                  ? "bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-300 dark:to-blue-400"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-300 dark:to-gray-400"
                                }`}
                              style={{
                                width: `${Math.min((item.totalQuantity / Math.max(...(data || []).map((d) => d?.totalQuantity))) * 100, 100)}%`,
                              }}
                            />
                          </div>
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
                <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Books Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {search || filter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No books have been borrowed yet."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          {/* {(filteredAndSortedData || [])?.length > 0 && (
            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedData?.length} of {borrowData?.data.p} books
              {search && ` matching "${search}"`}
              {filter !== "all" && ` with ${filter} borrow counts`}
            </div>
          )} */}
        </div>
      </div>
    )
  }
}
