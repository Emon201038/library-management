"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce";
import { setPage, setSearch } from "@/redux/features/books/bookSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Search, BookOpen, Users, Star, XIcon } from "lucide-react"
import { useState } from "react";

export function HeroSection() {
  const [inputValue, setInputValue] = useState("");

  const dispatch = useAppDispatch();

  const debouncedSearch = useDebounce((value: string) => {
    dispatch(setSearch(value));
    dispatch(setPage(1)); // Reset page to 1 when search changes
    const element = document.getElementById('books-list');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedSearch(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const element = document.getElementById('books-list');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-500/20"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Your Next
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Great Read</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Explore millions of books, find your favorites, and connect with a communeavailable of readers. Your perfect book
            is just a search away.
          </p>

          {/* Hero Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSubmit} className="relative">

              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                name="search"
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Search for books, authors, or genres..."
                className="pl-12 pr-4 py-4 text-lg w-full rounded-full border-2 border-gray-200 focus:border-blue-500"
              />
              {inputValue &&
                <Button onClick={() => {
                  setInputValue("");
                  dispatch(setSearch(""));
                }} type="button" size={"icon"} className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-200 h-5 w-5 bg-transparent hover:bg-transparent">
                  <XIcon />
                </Button>
              }
              <Button className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full px-6">Search</Button>
            </form>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-white">10M+</div>
              <div className="text-gray-300">Books Available</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-white">2M+</div>
              <div className="text-gray-300">Active Readers</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-white">50M+</div>
              <div className="text-gray-300">Reviews & Ratings</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
