"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3 } from 'lucide-react'



export function BorrowSummarySkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header Skeleton */}
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
                <p className="text-gray-600 dark:text-gray-400 mt-2">Loading borrow data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Borrowed Card */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2 bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-700" />
                  <Skeleton className="h-8 w-16 bg-gradient-to-r from-blue-300 to-blue-400 dark:from-blue-700 dark:to-blue-600" />
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full animate-pulse">
                  <div className="h-6 w-6 bg-white/30 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unique Books Card */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700" />
                  <Skeleton className="h-8 w-12 bg-gradient-to-r from-green-300 to-green-400 dark:from-green-700 dark:to-green-600" />
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full animate-pulse">
                  <div className="h-6 w-6 bg-white/30 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average per Book Card */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-28 mb-2 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700" />
                  <Skeleton className="h-8 w-14 bg-gradient-to-r from-purple-300 to-purple-400 dark:from-purple-700 dark:to-purple-600" />
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-full animate-pulse">
                  <div className="h-6 w-6 bg-white/30 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Most Popular Card */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2 bg-gradient-to-r from-orange-200 to-orange-300 dark:from-orange-800 dark:to-orange-700" />
                  <Skeleton className="h-5 w-32 mb-1 bg-gradient-to-r from-orange-300 to-orange-400 dark:from-orange-700 dark:to-orange-600" />
                  <Skeleton className="h-3 w-16 bg-gradient-to-r from-orange-200 to-orange-300 dark:from-orange-800 dark:to-orange-700" />
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 rounded-full animate-pulse">
                  <div className="h-6 w-6 bg-white/30 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search Skeleton */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl dark:shadow-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Skeleton className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-600" />
                </div>
                <Skeleton className="h-10 w-full pl-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
              </div>

              <div className="flex gap-2 items-center">
                <Skeleton className="h-4 w-4 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md" />
              </div>

              <div className="flex gap-2 items-center">
                <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md" />
                <Skeleton className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
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
                    <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 animate-pulse">
                      <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 dark:from-gray-700/20 dark:to-gray-700/5 rounded-lg"></div>
                    </div>
                  </div>

                  {/* Book Info Skeleton */}
                  <div className="flex-1 min-w-0">
                    {/* Title Skeleton */}
                    <div className="mb-2">
                      <Skeleton className="h-5 w-full mb-1 bg-gray-300 dark:bg-gray-600" />
                      <Skeleton className="h-5 w-3/4 bg-gray-300 dark:bg-gray-600" />
                    </div>

                    {/* ISBN Badge Skeleton */}
                    <div className="mb-3">
                      <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    </div>

                    {/* Total Borrowed Section */}
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-4 w-24 bg-gray-300 dark:bg-gray-600" />
                      <Skeleton className="h-8 w-12 bg-gradient-to-r from-blue-300 to-blue-400 dark:from-blue-600 dark:to-blue-500 rounded-full" />
                    </div>

                    {/* Progress Bar Skeleton */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <Skeleton className="h-2 rounded-full bg-gradient-to-r from-blue-300 to-blue-400 dark:from-blue-600 dark:to-blue-500 animate-pulse" style={{ width: `${Math.random() * 80 + 20}%` }} />
                      </div>
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
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-pink-500 dark:bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm">Loading borrow summary...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
