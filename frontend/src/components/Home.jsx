// import React, { useState, useEffect } from 'react';
// import { Film, Moon, ShieldUser, Sun } from 'lucide-react';
// import MovieCarousel from './MovieCarousel.jsx';
// import MovieLogo from "../assets/logo.png";
// import { Link } from 'react-router-dom';

// const categories = [
//   { id: 'all', name: 'All' },
//   { id: 'thriller', name: 'Thriller/Sci-fi' },
//   { id: 'romance', name: 'Romance' },
//   { id: 'anime', name: 'Anime' },
//   { id: 'hollywood', name: 'Hollywood' }
// ];

// const movieData = {
//   thriller: [
//     { id: 1, title: "Baida", image: "https://m.media-amazon.com/images/M/MV5BMTYxZTJiN2ItNzQzOS00ZjA2LWIwZjUtZjBhYWMyZTgwZGRjXkEyXkFqcGc@._V1_.jpg" },
//     { id: 2, title: "Fantasy Island (2020)", image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQAsfEfV4ytLk5JvhMipdH7zlW28g5l-DGZyM61GOhXzEzNbaW5ml6rOmDuzKqMm6_0caFM9A" },
//   ],
//   romance: [
//     { id: 1, title: "The Notebook", image: "https://images.unsplash.com/photo-1516486392848-8b67ef89f113?w=800&auto=format&fit=crop&q=60" },
//     { id: 2, title: "La La Land", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=60" },
//     { id: 3, title: "Pride & Prejudice", image: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&auto=format&fit=crop&q=60" },
//     { id: 4, title: "Eternal Sunshine", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60" },
//   ],
//   anime: [
//     { id: 5, title: "Death Note", image: "https://m.media-amazon.com/images/M/MV5BYTgyZDhmMTEtZDFhNi00MTc4LTg3NjUtYWJlNGE5Mzk2NzMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", episodes: 1 },
//     { id: 6, title: "Your Name", image: "https://m.media-amazon.com/images/M/MV5BMjI1ODZkYTgtYTY3Yy00ZTJkLWFkOTgtZDUyYWM4MzQwNjk0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", episodes: 1 },
//     { id: 7, title: "Suzume", image: "https://m.media-amazon.com/images/M/MV5BNjBiM2FkN2QtNDRmOS00ZGY4LTkyNjUtMDQ1ZjgzMTI2MzZjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", episodes: 75 },
//     { id: 8, title: "Demon Slayer", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop&q=60", episodes: 44 },
//   ],
//   hollywood: [
//     { id: 9, title: "Inception", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=60" },
//     { id: 10, title: "The Dark Knight", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=60" },
//     { id: 11, title: "Interstellar", image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&auto=format&fit=crop&q=60" },
//     { id: 12, title: "Avatar", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60" },
//   ],
//   all: [] // Will be populated below
// };

// // Populate the 'all' category with movies from all other categories
// movieData.all = Object.entries(movieData)
//   .filter(([key]) => key !== 'all')
//   .flatMap(([_, movies]) => movies)
//   .sort((a, b) => a.title.localeCompare(b.title));

// function Home() {
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [darkMode, setDarkMode] = useState(() => {
//     if (typeof window !== 'undefined') {
//       return localStorage.getItem('darkMode') === 'true';
//     }
//     return false;
//   });

//   useEffect(() => {
//     localStorage.setItem('darkMode', darkMode.toString());
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   return (
//     <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-[#eeeeee]'}`}>
//       {/* Fixed Header */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md">
//         <div className="container mx-auto px-5 sm:px-20 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <img 
//               // className={`h-6 w-auto sm:h-10`}
//               className={`h-6 w-auto sm:h-10 transform translate-y-1 sm:translate-y-0`}
//                src={MovieLogo} alt='logo' />
//             <h1 className='text-black font-semibold text-2xl pt-4'>etflix</h1>
//             </div>
//             <div  className='flex items-center gap-4'>
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className="p-1 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
//               aria-label="Toggle dark mode"
//             >
//               {darkMode ? (
//                 <Sun className="text-yellow-400" size={23} />
//               ) : (
//                 <Moon className="text-gray-600" size={23} />
//               )}
//             </button>
//             <Link
//             to="/admin-dashboard"
//               className="p-1 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
//               aria-label="Toggle dark mode"
//             >
//                 <ShieldUser className="text-yellow-400" size={24} />
//               {/* {darkMode ? (
//                 <ShieldUser className="text-yellow-400" size={20} />
//               ) : (
//                 <ShieldUser className="text-gray-600" size={20} />
//               )} */}
//             </Link>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Marquee Text */}
//       <div className="bg-blue-600 dark:bg-blue-800 text-white py-2 mt-16 overflow-hidden">
//         <div className="animate-marquee whitespace-nowrap">
//           🎬 Welcome to StreamFlix - Your Ultimate Streaming Destination! New releases every week! Watch anywhere, anytime. Premium content available in 4K HDR. 🎥 Join now and get 30 days free trial!
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 sm:px-6 py-6 mt-4 md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
//         {/* Categories - Scrollable on mobile */}
//         <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
//           <div className="flex gap-2 w-max">
//             {categories.map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-medium text-sm sm:text-base transition-colors ${
//                   selectedCategory === category.id
//                     ? 'bg-blue-600 dark:bg-blue-500 text-white'
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 {category.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Movie Carousels */}
//         <div className="space-y-2 sm:space-y-2">
//           {(selectedCategory === 'all' 
//             ? categories.filter(c => c.id !== 'all')
//             : [categories.find(c => c.id === selectedCategory)]
//           ).map((category) => (
//             category && (
//               <MovieCarousel
//                 key={category.id}
//                 title={category.name}
//                 movies={movieData[category.id]}
//                 darkMode={darkMode}
//               />
//             )
//           ))}
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white dark:bg-gray-900 shadow-md mt-8">
//         <div className="container mx-auto px-4 sm:px-6 py-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:px-10">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About MetFlix</h3>
//               <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
//                 Your ultimate destination for streaming movies and TV shows. Watch anywhere, anytime.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
//               <ul className="space-y-1.5 text-sm sm:text-base text-gray-600 dark:text-gray-400">
//                 <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Home</li>
//                 <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Movies</li>
//                 <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">TV Shows</li>
//                 <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">My List</li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact</h3>
//               <ul className="space-y-1.5 text-sm sm:text-base text-gray-600 dark:text-gray-400">
//                 <li>Email: support@metflix.com</li>
//                 <li>Phone: 1-800-METFLIX</li>
//                 <li>Address: 123 Stream St, Movie City</li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6 text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
//             © 2025 MFlix. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Home;




import React, { useState, useEffect } from 'react';
import { Film, Moon, ShieldUser, Sun } from 'lucide-react';
import MovieCarousel from './MovieCarousel';
import MovieLogo from "../assets/logo.png";
import { Link } from 'react-router-dom';
import axios from 'axios';

// Define all possible categories from your enum
const ALL_CATEGORIES = [
  'Bollywood',
  'Hollywood',
  'Anime',
  'South',
  'Web-series',
  'Action',
  'Comedy',
  'Drama',
  'Sci-fi',
  'Horror',
  'Romance',
  'Other'
];

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allMovies, setAllMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [bandwidthStatus, setBandwidthStatus] = useState({
    isLimitReached: false,
    resetTime: '',
    isResetPeriod: false
  });
  const [showBandwidthMarquee, setShowBandwidthMarquee] = useState(false);
  
  // Update your useEffect
  useEffect(() => {
    const fetchBandwidthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bandwidth-status');
        const { isLimitReached, resetTime, isResetPeriod } = response.data;
        console.log(response.data);
        
        setBandwidthStatus({
          isLimitReached,
          resetTime,
          isResetPeriod
        });
        
        // Show marquee when NOT limited (including reset period)
        setShowBandwidthMarquee(!isLimitReached);
        
      } catch (error) {
        console.error('Error fetching bandwidth status:', error);
      }
    };
  
    fetchBandwidthStatus();
    const interval = setInterval(fetchBandwidthStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  



  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all movies
        const response = await axios.get('http://localhost:5000/api/movies');
        setAllMovies(response.data);
        console.log(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get categories that actually have movies
  const categoriesWithMovies = [...new Set(allMovies.map(movie => movie.category))];

  // Prepare categories data
  const categories = [
    { id: 'all', name: 'All' },
    ...ALL_CATEGORIES.map(cat => ({
      id: cat.toLowerCase(),
      name: cat,
      hasMovies: categoriesWithMovies.includes(cat)
    }))
  ];

  // Filter movies based on selected category
  const filteredMovies = selectedCategory === 'all' 
    ? allMovies 
    : allMovies.filter(movie => 
        movie.category.toLowerCase() === selectedCategory
      );

  // Group movies by category for the "All" view (only categories with movies)
  const moviesByCategory = {};
  categoriesWithMovies.forEach(category => {
    moviesByCategory[category] = allMovies.filter(movie => movie.category === category);
  });

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-[#eeeeee]'}`}>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-5 sm:px-20 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                className={`h-8 w-auto sm:h-10 transform translate-y-1 sm:translate-y-0`}
                src={MovieLogo} 
                alt='logo' 
              />
              <h1 className='text-black dark:text-white font-semibold text-2xl pt-4'>etflix</h1>
            </div>
            <div className='flex items-center gap-4'>
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
                to="/login"
                className="p-1 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label="Admin dashboard"
              >
                <ShieldUser className="text-yellow-400" size={24} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Marquee Text */}
      {/* <div className="bg-blue-600 dark:bg-blue-800 text-white py-2 mt-16 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap pt-1">
          🎬 Welcome to MetFlix - Your Ultimate Streaming Destination! New releases every week! Watch anywhere, anytime. Premium content available in 4K HDR. 🎥 Join now and get 30 days free trial!
        </div>
      </div> */}
      {showBandwidthMarquee && (
  <div className="bg-green-500 dark:bg-green-800 text-white py-2 mt-16 overflow-hidden">
    <div 
      className="whitespace-nowrap pt-1"
      style={{
        display: 'inline-block',
        paddingLeft: '100%',
        animation: 'marquee 15s linear infinite',
        willChange: 'transform' // Optimize for performance
      }}
    >
      {bandwidthStatus.isResetPeriod ? (
        "🎉 Bandwidth limit has been reset! Enjoy unlimited streaming until next limit period. "
      ) : (
        "🎬 Welcome to MetFlix - Your Ultimate Streaming Destination! Enjoy your movies! "
      )}
    </div>
  </div>
)}


      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 mt-4 md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Categories - Scrollable vertically when needed */}
        <div className="mb-6 max-h-40 overflow-y-auto pb-2 px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-medium text-sm sm:text-base transition-colors flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${
                  !category.hasMovies && category.id !== 'all' ? 'opacity-50' : ''
                }`}
                disabled={!category.hasMovies && category.id !== 'all'}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading ? (
          
          <div className="loader relative w-12 h-12 mx-auto">
        {/* The jumping square (main element) */}
        <div className="absolute inset-0 bg-pink-400 rounded-md animate-jump"></div>
        
        {/* The shadow (pseudo-element replacement) */}
        <div className="absolute top-[60px] left-0 w-12 h-1.5 bg-pink-400/30 rounded-full animate-shadow"></div>
      </div>
        ) : (
          /* Movie Display */
          <div className="space-y-8">
            {selectedCategory === 'all' ? (
              // Display only categories that have movies
              categoriesWithMovies.length > 0 ? (
                categoriesWithMovies.map((category) => (
                  <div key={category}>
                    <h2 className={`text-2xl font-semibold mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {category}
                    </h2>
                    <MovieCarousel
                      movies={moviesByCategory[category]}
                      darkMode={darkMode}
                      showTitle={false}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No movies available in any category.
                  </p>
                </div>
              )
            ) : filteredMovies.length > 0 ? (
              // Display movies for selected category
              <MovieCarousel
                title={categories.find(c => c.id === selectedCategory)?.name || ''}
                movies={filteredMovies}
                darkMode={darkMode}
              />
            ) : (
              // No movies available for selected category
              <div className="text-center py-10">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No movies available in this category.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 shadow-md">
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
                <li>Email: developersonupr@gmail.com</li>
                <li>Phone: 1-800-METFLIX</li>
                <li>Address: 123 Stream St, Movie City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6 text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
          &copy;{new Date().getFullYear()}  MetFlix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;