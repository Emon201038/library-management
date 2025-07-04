"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Heart, User, MenuIcon, PlusCircleIcon } from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { ModeToggle } from "./mode-toggle"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    params.set("search", searchQuery);
    setUrlSearchParams(params);

    setIsMenuOpen(false);
    navigate(`?${params}`);
    const element = document.getElementById('books-list');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <nav className="shadow-sm border-b sticky top-0 z-50 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={"/"} className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">BookFinder</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input name="search" type="text" placeholder="Search books, authors, genres..." className="pl-10 pr-4 w-full" />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button onClick={() => navigate("/")} variant="ghost" className="text-gray-700 dark:text-white hover:text-blue-600">
              Browse
            </Button>
            <Button onClick={() => navigate("/#categories")} variant="ghost" className="text-gray-700 dark:text-white hover:text-blue-600">
              Categories
            </Button>
            <Button onClick={() => navigate("/wishlist")} variant="ghost" className="text-gray-700 dark:text-white hover:text-blue-600">
              <Heart className="h-4 w-4 mr-1" />
              Wishlist
            </Button>
            <Button onClick={() => navigate("/create-book")} variant="ghost" className="text-gray-700 dark:text-white hover:text-blue-600">
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Book
            </Button>
            <Button variant="outline" className="text-gray-700 dark:text-white hover:text-blue-600 bg-transparent">
              <User className="h-4 w-4 mr-1" />
              Sign In
            </Button>
            <ModeToggle />
          </div>


          <div className="md:hidden flex gap-1 items-center">
            {/* Mobile menu button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden flex gap-1 items-center">
                <Button variant="ghost" size="sm">
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className=" pb-6 ">
                <SheetTitle className="sr-only">Nav Menue</SheetTitle>
                <div className="flex flex-col space-y-1.5 justify-center items-start">
                  {/* Mobile Search */}
                  <form onSubmit={handleSubmit} className="md:hidden pt-10 p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input name="search" type="text" placeholder="Search books..." className="pl-10 pr-4 w-full" />
                    </div>
                  </form>
                  {[
                    {
                      id: 1,
                      name: "Browse",
                      href: "/",
                    },
                    {
                      id: 2,
                      name: "Categories",
                      href: "/#categories",
                    },
                    {
                      id: 3,
                      name: "Wishlist",
                      href: "/wishlist",
                      icon: <Heart className="h-4 w-4 mr-1" />,
                    },
                    {
                      id: 4,
                      name: "Add Book",
                      href: "/create-book",
                      icon: <PlusCircleIcon className="h-4 w-4 mr-1" />,
                    },
                    {
                      id: 5,
                      name: "Sign In",
                      href: "/signin",
                      icon: <User className="h-4 w-4 mr-1" />,
                    }
                  ].map((link) => (
                    <Link onClick={() => setIsMenuOpen(false)} key={link.id} to={link.href} className="text-gray-700 dark:text-white hover:text-blue-600 flex gap-3 items-center cursor-pointer w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
