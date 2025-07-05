
import { useEffect, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Calendar,
  Globe,
  FileText,
  Building,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Users,
  ThumbsUp,
} from "lucide-react"
import type { Review } from "@/types/book"
import { useParams } from "react-router"
import { useGetBookQuery } from "@/redux/features/books/booksApi"
import { BookDetailSkeleton } from "../single-book-loading"
import { useAppDispatch } from "@/redux/hooks"
import { setOpenBorrowModal, setSelectedBook } from "@/redux/features/books/bookSlice"
import BorrowModal from "../borrow-modal"

// Sample reviews
const sampleReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Sarah Johnson",
    rating: 5,
    comment:
      "An absolute masterpiece! Fitzgerald's prose is beautiful and the story is both tragic and captivating. The symbolism and themes are incredibly deep.",
    date: "2024-01-15",
    helpful: 24,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Michael Chen",
    rating: 4,
    comment:
      "A classic for a reason. The writing style took some getting used to, but the story and characters are unforgettable. Great insight into the American Dream.",
    date: "2024-01-10",
    helpful: 18,
  },
  {
    id: "3",
    userId: "user3",
    userName: "Emma Davis",
    rating: 4,
    comment:
      "Beautiful language and compelling characters. The ending was both satisfying and heartbreaking. Definitely worth reading multiple times.",
    date: "2024-01-08",
    helpful: 12,
  },
]

export function BookDetail() {
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">("overview")

  // In a real app, you would fetch the book data based on bookId

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const getRatingDistribution = () => {
    // Mock rating distribution
    return [
      { stars: 5, count: 1420, percentage: 50 },
      { stars: 4, count: 854, percentage: 30 },
      { stars: 3, count: 427, percentage: 15 },
      { stars: 2, count: 114, percentage: 4 },
      { stars: 1, count: 32, percentage: 1 },
    ]
  }

  const params = useParams();
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, error } = useGetBookQuery(params.id as string, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setSelectedBook(data.data))
    }
  }, [data?.data, dispatch])


  let content: ReactNode;
  if (isLoading) {
    content = <BookDetailSkeleton />
  };
  if (!isLoading && isError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorData = error as any
    content = <div className="text-red-500 font-bold text-[5vw] py-16 text-center">
      {errorData?.error || errorData?.data?.message}
    </div>
  };
  if (!isLoading && !isError && !data) {
    content = <div>Book not found</div>
  };
  if (!isLoading && !isError && data) {
    const book = data.data
    content = <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 py-0">
              <CardContent className="p-6">
                {/* Book Cover */}
                {book?.image ? <img src={book?.image} alt={book?.title} className="w-full aspect-[3/4] object-cover" /> : <div className="relative aspect-[3/4] bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-lg flex items-center justify-center mb-6">
                  {/* Add subtle pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <BookOpen className="h-24 w-24 text-gray-400" />
                </div>}

                {/* Availability Status */}
                <div className="mb-4">
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
                  <p className="text-sm text-gray-600 mt-1">
                    {book.copies} copies available
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full" disabled={!book.available || book.copies === 0}
                    onClick={() => {
                      dispatch(setSelectedBook(book))
                      dispatch(setOpenBorrowModal(true))
                    }}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {book.available && book.copies > 0 ? "Borrow Book" : "Unavailable"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      {isFavorite ? "Favorited" : "Add to Favorites"}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Price */}
                {book.price && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{book.price}</div>
                    <div className="text-sm text-gray-600">Purchase Price</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Info */}
            <Card className="py-0">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-2">
                    {book.genre.replace("_", " ").toUpperCase()}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      {renderStars(book.rating || 0)}
                      <span className="ml-2 text-lg font-semibold">{book.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-500">
                      <Users className="h-4 w-4 inline mr-1" />
                      {book.reviewCount?.toLocaleString()} reviews
                    </div>
                  </div>
                </div>

                {/* Book Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {book.publishedYear && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <div>
                        <div className="font-medium">Published</div>
                        <div>{book.publishedYear}</div>
                      </div>
                    </div>
                  )}
                  {book.pages && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-500">
                      <FileText className="h-4 w-4 mr-2" />
                      <div>
                        <div className="font-medium">Pages</div>
                        <div>{book.pages}</div>
                      </div>
                    </div>
                  )}
                  {book.language && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-500">
                      <Globe className="h-4 w-4 mr-2" />
                      <div>
                        <div className="font-medium">Language</div>
                        <div>{book.language}</div>
                      </div>
                    </div>
                  )}
                  {book.publisher && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-500">
                      <Building className="h-4 w-4 mr-2" />
                      <div>
                        <div className="font-medium">Publisher</div>
                        <div>{book.publisher}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-500 mb-4">
                  <strong>ISBN:</strong> {book.isbn}
                </div>

                <Separator className="my-4" />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 dark:text-gray-400 leading-relaxed">{book.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex border-b">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                onClick={() => setActiveTab("overview")}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Overview
              </Button>
              <Button
                variant={activeTab === "reviews" ? "default" : "ghost"}
                onClick={() => setActiveTab("reviews")}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Reviews ({book.reviewCount})
              </Button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <Card>
                <CardHeader>
                  <CardTitle>Book Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">About this book</h4>
                      <p className="text-gray-700 dark:text-gray-600">
                        This edition of {book.title} is part of our classic literature collection, carefully curated for
                        readers who appreciate timeless storytelling and literary excellence.
                      </p>
                    </div>
                    {/* <div>
                      <h4 className="font-semibold mb-2">Key Themes</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">American Dream</Badge>
                        <Badge variant="secondary">Social Class</Badge>
                        <Badge variant="secondary">Love & Obsession</Badge>
                        <Badge variant="secondary">Moral Decay</Badge>
                        <Badge variant="secondary">Jazz Age</Badge>
                      </div>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Reader Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">{book.rating}</div>
                        <div className="flex justify-center mb-2">{renderStars(book.rating || 0)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-500">{book.reviewCount} reviews</div>
                      </div>
                      <div className="space-y-2">
                        {getRatingDistribution().map((item) => (
                          <div key={item.stars} className="flex items-center gap-2 text-sm">
                            <span className="w-8">{item.stars}★</span>
                            <Progress value={item.percentage} className="flex-1" />
                            <span className="w-12 text-gray-600 dark:text-gray-500">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {sampleReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-200">{review.userName}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <span className="text-sm text-gray-600 dark:text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-500 mb-3">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-500">
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful ({review.helpful})
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  };

  return (
    <>
      {content}
      <BorrowModal />
    </>
  )
}
