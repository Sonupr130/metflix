import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard.jsx';
import MovieDetails from './MovieDetails.jsx';

const MovieCarousel = ({ title, movies, darkMode }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const scroll = (direction) => {
    const container = document.getElementById(`carousel-${title}`);
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white px-4">{title}</h2>
      
      <div className="relative group">
        <div
          id={`carousel-${title}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 pb-4 -mx-4 touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              title={movie.title}
              image={movie.coverImage}
              onClick={() => setSelectedMovie(movie)}
              darkMode={darkMode}
            />
          ))}
        </div>
        
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 hidden md:block"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 hidden md:block"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default MovieCarousel;













