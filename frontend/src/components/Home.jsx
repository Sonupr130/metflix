import React, { useState, useEffect } from 'react';
import { Film, Moon, ShieldUser, Sun } from 'lucide-react';
import MovieCarousel from './MovieCarousel.jsx';
import MovieLogo from "../assets/logo.png";
import { Link } from 'react-router-dom';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'thriller', name: 'Thriller/Sci-fi' },
  { id: 'romance', name: 'Romance' },
  { id: 'anime', name: 'Anime' },
  { id: 'hollywood', name: 'Hollywood' }
];

const movieData = {
  thriller: [
    { id: 1, title: "Baida", image: "https://m.media-amazon.com/images/M/MV5BMTYxZTJiN2ItNzQzOS00ZjA2LWIwZjUtZjBhYWMyZTgwZGRjXkEyXkFqcGc@._V1_.jpg" },
    { id: 2, title: "Fantasy Island (2020)", image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQAsfEfV4ytLk5JvhMipdH7zlW28g5l-DGZyM61GOhXzEzNbaW5ml6rOmDuzKqMm6_0caFM9A" },
  ],
  romance: [
    { id: 1, title: "The Notebook", image: "https://images.unsplash.com/photo-1516486392848-8b67ef89f113?w=800&auto=format&fit=crop&q=60" },
    { id: 2, title: "La La Land", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=60" },
    { id: 3, title: "Pride & Prejudice", image: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&auto=format&fit=crop&q=60" },
    { id: 4, title: "Eternal Sunshine", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60" },
  ],
  anime: [
    { id: 5, title: "Death Note", image: "https://m.media-amazon.com/images/M/MV5BYTgyZDhmMTEtZDFhNi00MTc4LTg3NjUtYWJlNGE5Mzk2NzMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", episodes: 1 },
    { id: 6, title: "Your Name", image: "https://m.media-amazon.com/images/M/MV5BMjI1ODZkYTgtYTY3Yy00ZTJkLWFkOTgtZDUyYWM4MzQwNjk0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", episodes: 1 },
    { id: 7, title: "Suzume", image: "https://m.media-amazon.com/images/M/MV5BNjBiM2FkN2QtNDRmOS00ZGY4LTkyNjUtMDQ1ZjgzMTI2MzZjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", episodes: 75 },
    { id: 8, title: "Demon Slayer", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop&q=60", episodes: 44 },
  ],
  hollywood: [
    { id: 9, title: "Inception", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=60" },
    { id: 10, title: "The Dark Knight", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=60" },
    { id: 11, title: "Interstellar", image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&auto=format&fit=crop&q=60" },
    { id: 12, title: "Avatar", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60" },
  ],
  all: [] // Will be populated below
};

// Populate the 'all' category with movies from all other categories
movieData.all = Object.entries(movieData)
  .filter(([key]) => key !== 'all')
  .flatMap(([_, movies]) => movies)
  .sort((a, b) => a.title.localeCompare(b.title));

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-[#eeeeee]'}`}>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-5 sm:px-20 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
              // className={`h-6 w-auto sm:h-10`}
              className={`h-6 w-auto sm:h-10 transform translate-y-1 sm:translate-y-0`}
               src={MovieLogo} alt='logo' />
            <h1 className='text-black font-semibold text-2xl pt-4'>etflix</h1>
            </div>
            <div  className='flex items-center gap-4'>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="text-yellow-400" size={23} />
              ) : (
                <Moon className="text-gray-600" size={23} />
              )}
            </button>
            <Link
            to="/admin-dashboard"
              className="p-1 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
                <ShieldUser className="text-yellow-400" size={24} />
              {/* {darkMode ? (
                <ShieldUser className="text-yellow-400" size={20} />
              ) : (
                <ShieldUser className="text-gray-600" size={20} />
              )} */}
            </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Marquee Text */}
      <div className="bg-blue-600 dark:bg-blue-800 text-white py-2 mt-16 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          🎬 Welcome to StreamFlix - Your Ultimate Streaming Destination! New releases every week! Watch anywhere, anytime. Premium content available in 4K HDR. 🎥 Join now and get 30 days free trial!
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 mt-4 md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
        {/* Categories - Scrollable on mobile */}
        <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-medium text-sm sm:text-base transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Carousels */}
        <div className="space-y-2 sm:space-y-2">
          {(selectedCategory === 'all' 
            ? categories.filter(c => c.id !== 'all')
            : [categories.find(c => c.id === selectedCategory)]
          ).map((category) => (
            category && (
              <MovieCarousel
                key={category.id}
                title={category.name}
                movies={movieData[category.id]}
                darkMode={darkMode}
              />
            )
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 shadow-md mt-8">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:px-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About MetFlix</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Your ultimate destination for streaming movies and TV shows. Watch anywhere, anytime.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
              <ul className="space-y-1.5 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Home</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Movies</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">TV Shows</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">My List</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact</h3>
              <ul className="space-y-1.5 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li>Email: support@metflix.com</li>
                <li>Phone: 1-800-METFLIX</li>
                <li>Address: 123 Stream St, Movie City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6 text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
            © 2025 MFlix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;