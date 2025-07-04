"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BookDetailSkeleton() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Actions Skeleton */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-0 shadow-xl py-0">
              <CardContent className="p-6">
                {/* Book Cover Skeleton */}
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-6 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-lg"></div>
                </div>

                {/* Availability Status Skeleton */}
                <div className="mb-4">
                  <Skeleton className="h-6 w-20 mb-2 bg-gradient-to-r from-gray-200 to-gray-300" />
                  <Skeleton className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full bg-gradient-to-r from-blue-200 to-purple-200" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 bg-gradient-to-r from-pink-200 to-red-200" />
                    <Skeleton className="h-10 w-10 bg-gradient-to-r from-blue-200 to-purple-200" />
                  </div>
                </div>

                {/* Price Skeleton */}
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <Skeleton className="h-8 w-16 mb-1 bg-gradient-to-r from-green-200 to-emerald-200" />
                  <Skeleton className="h-4 w-24 bg-gradient-to-r from-green-200 to-emerald-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Info Skeleton */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Skeleton className="h-6 w-24 mb-2 bg-gradient-to-r from-blue-200 to-purple-200" />
                  <Skeleton className="h-9 w-3/4 mb-2 bg-gradient-to-r from-gray-300 to-gray-400" />
                  <Skeleton className="h-6 w-1/2 mb-4 bg-gradient-to-r from-gray-200 to-gray-300" />

                  {/* Rating Skeleton */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-4 bg-yellow-200" />
                      ))}
                      <Skeleton className="h-5 w-8 ml-2 bg-gradient-to-r from-gray-200 to-gray-300" />
                    </div>
                    <Skeleton className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300" />
                  </div>
                </div>

                {/* Book Details Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300" />
                      <Skeleton className="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300" />
                    </div>
                  ))}
                </div>

                <Skeleton className="h-4 w-48 mb-4 bg-gradient-to-r from-gray-200 to-gray-300" />

                <div className="border-t border-gray-200 my-4"></div>

                {/* Description Skeleton */}
                <div>
                  <Skeleton className="h-6 w-24 mb-3 bg-gradient-to-r from-gray-300 to-gray-400" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300" />
                    <Skeleton className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300" />
                    <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Skeleton */}
            <div className="flex border-b space-x-4">
              <Skeleton className="h-10 w-20 bg-gradient-to-r from-blue-200 to-purple-200" />
              <Skeleton className="h-10 w-24 bg-gradient-to-r from-blue-200 to-purple-200" />
            </div>

            {/* Tab Content Skeleton */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gradient-to-r from-gray-300 to-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-5 w-28 mb-2 bg-gradient-to-r from-gray-300 to-gray-400" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300" />
                      <Skeleton className="h-4 w-5/6 bg-gradient-to-r from-gray-200 to-gray-300" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-5 w-24 mb-2 bg-gradient-to-r from-gray-300 to-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-20 bg-gradient-to-r from-blue-200 to-purple-200" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
