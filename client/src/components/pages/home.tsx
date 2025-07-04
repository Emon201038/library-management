import { Filter } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { HeroSection } from "../hero-section";
import BookList from "../book-list";
import EditBookModal from "../edit-book-modal";


const genres = [
  "All",
  "Fiction",
  "Fantasy",
  "Classic Literature",
  "Romance",
  "Dystopian Fiction",
  "Coming-of-age",
  "Adventure Fiction",
]


const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [selectedGenre, setSelectedGenre] = useState(params.get("filter") || "All")
  const navigate = useNavigate();


  return (
    <>
      <HeroSection />
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Books</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our curated collection of must-read books across various genres
            </p>
          </div>

          {/* Genre Filter */}
          <div id="categories" className="flex flex-wrap justify-center gap-2 mb-8">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2 mt-2" />
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre.toLowerCase().replace(" ", "-") ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedGenre(genre.toLowerCase().replace(" ", "-"));
                  params.set("filter", genre.toLowerCase().replace(" ", "-"));
                  setSearchParams(params);
                  navigate(`?${params}`);
                }}
                className="mb-2"
              >{genre}
              </Button>
            ))}
          </div>

          {/* Books Grid */}
          <BookList />

        </div>
      </section>
      <EditBookModal />
    </>
  )
}

export default Home