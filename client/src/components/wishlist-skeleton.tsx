"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WishlistSkeletonProps {
  onBack?: () => void
}

export function WishlistSkeleton({ onBack }: WishlistSkeletonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/20 to-purple-50/20 dark:from-gray-900 dark:via-pink-900/20 dark:to-purple-900/20">
      {/* Header Skeleton */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex items-center gap-2 bg-transparent hover:bg-pink-50 dark:hover:bg-pink-900/20 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Books
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-pink-800 to-purple-800 dark:from-gray-100 dark:via-pink-200 dark:to-purple-200 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 rounded-lg">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  My Wishlist
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Loading your wishlist...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { color: "pink", label: "Total Books" },
            { color: "green", label: "Available Now" },
            { color: "red", label: "High Priority" },
            { color: "blue", label: "Avg. Rating" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton
                      className={`h-4 w-24 mb-2 bg-gradient-to-r from-${stat.color}-200 to-${stat.color}-300 dark:from-${stat.color}-800 dark:to-${stat.color}-700`}
                    />
                    <Skeleton
                      className={`h-8 w-16 bg-gradient-to-r from-${stat.color}-300 to-${stat.color}-400 dark:from-${stat.color}-700 dark:to-${stat.color}-600`}
                    />
                  </div>
                  <div
                    className={`p-3 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 dark:from-${stat.color}-400 dark:to-${stat.color}-500 rounded-full animate-pulse`}
                  >
                    <div className="h-6 w-6 bg-white/30 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Skeleton className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-600" />
                </div>
                <Skeleton className="h-10 w-full pl-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Books Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl animate-pulse"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Book Cover Skeleton */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-32 rounded-lg bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-pink-800 dark:via-purple-800 dark:to-blue-800 animate-pulse relative">
                      <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 dark:from-gray-700/20 dark:to-gray-700/5 rounded-lg"></div>
                      <div className="absolute top-2 left-2">
                        <Skeleton className="h-6 w-6 rounded-full bg-red-300 dark:bg-red-600" />
                      </div>
                    </div>
                  </div>

                  {/* Book Info Skeleton */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-5 w-full mb-1 bg-gray-300 dark:bg-gray-600" />
                        <Skeleton className="h-4 w-3/4 mb-2 bg-gray-300 dark:bg-gray-600" />
                      </div>
                      <Skeleton className="h-8 w-8 bg-red-200 dark:bg-red-700 rounded" />
                    </div>

                    <div className="flex gap-2 mb-2">
                      <Skeleton className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <Skeleton className="h-5 w-20 bg-green-200 dark:bg-green-700 rounded-full" />
                    </div>

                    <Skeleton className="h-4 w-24 mb-2 bg-yellow-200 dark:bg-yellow-700" />
                    <Skeleton className="h-4 w-32 mb-3 bg-gray-300 dark:bg-gray-600" />
                    <Skeleton className="h-3 w-full mb-3 bg-gray-200 dark:bg-gray-700" />

                    <div className="flex gap-2">
                      <Skeleton className="h-8 flex-1 bg-green-300 dark:bg-green-600 rounded" />
                      <Skeleton className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Message */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-pink-500 dark:bg-pink-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-sm">Loading your wishlist...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
