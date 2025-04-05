import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Download, List } from 'lucide-react';

const VideoStreamingApp = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Sample data
  const categories = [
    { id: 1, name: 'Romance', color: 'bg-pink-600' },
    { id: 2, name: 'Anime', color: 'bg-blue-600' },
    { id: 3, name: 'Hollywood', color: 'bg-red-600' }
  ];
  
  const movies = {
    Romance: [
      { id: 1, title: 'The Notebook', image: '/api/placeholder/300/450', episodes: 1 },
      { id: 2, title: 'Pride & Prejudice', image: '/api/placeholder/300/450', episodes: 1 },
      { id: 3, title: 'La La Land', image: '/api/placeholder/300/450', episodes: 1 },
      { id: 4, title: 'Before Sunrise', image: '/api/placeholder/300/450', episodes: 1 },
      { id: 5, title: 'Me Before You', image: '/api/placeholder/300/450', episodes: 1 }
    ],
    Anime: [
      { id: 1, title: 'Your Name', image: '/api/placeholder/300/450', episodes: 1 },
      { id: 2, title: 'Spirited Away', image: '/api/placeholder/300/450', episodes: 1 },
      { id: 3, title: 'Attack on Titan', image: '/api/placeholder/300/450', episodes: 25 },
      { id: 4, title: 'Demon Slayer', image: '/api/placeholder/300/450', episodes: 26 },
      { id: 5, title: 'My Hero Academia', image: '/api/placeholder/300/450', episodes: 25 }
    ],
    Hollywood: [
      { id: 1, title: 'Inception', image: '/api/placeholder/300/450', episodes: 1 },
      { id: 2, title: 'The Dark Knight', image: '/api/placeholder/300/450', episodes: 1 },
      { id: 3, title: 'Interstellar', image: '/api/placeholder/300/450', episodes: 1 },
      { id: 4, title: 'Avengers: Endgame', image: '/api/placeholder/300/450', episodes: 1 },
      { id: 5, title: 'Dune', image: '/api/placeholder/300/450', episodes: 1 }
    ]
  };
  
  // Scroll functions for carousel
  const scrollLeft = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  // Generate episode list
  const generateEpisodes = (count) => {
    return Array.from({ length: count }, (_, i) => i + 1);
  };
  
  // Modal view for selected movie
  const MovieDetailModal = ({ movie, onClose }) => {
    const [activeTab, setActiveTab] = useState('watch');
    const episodes = generateEpisodes(movie.episodes);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-full overflow-auto">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">{movie.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              &times;
            </button>
          </div>
          
          <div className="md:flex p-4">
            <div className="md:w-1/3 flex-shrink-0 mb-4 md:mb-0">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="w-full rounded-lg"
              />
            </div>
            
            <div className="md:w-2/3 md:pl-6">
              <div className="flex border-b border-gray-700 mb-4">
                <button 
                  className={`px-4 py-2 ${activeTab === 'watch' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('watch')}
                >
                  Watch Online
                </button>
                <button 
                  className={`px-4 py-2 ${activeTab === 'download' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('download')}
                >
                  Download
                </button>
                <button 
                  className={`px-4 py-2 ${activeTab === 'episodes' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
                  onClick={() => setActiveTab('episodes')}
                >
                  Episodes
                </button>
              </div>
              
              <div className="p-2">
                {activeTab === 'watch' && (
                  <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8">
                    <Play size={48} className="text-blue-500 mb-4" />
                    <p className="text-white text-center">Watch {movie.title} Online</p>
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                      Play Now
                    </button>
                  </div>
                )}
                
                {activeTab === 'download' && (
                  <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8">
                    <Download size={48} className="text-green-500 mb-4" />
                    <p className="text-white text-center">Download {movie.title}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        HD Quality
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        Medium Quality
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        Low Quality
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'episodes' && movie.episodes > 1 && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white mb-4">All Episodes</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {episodes.map(ep => (
                        <button 
                          key={ep} 
                          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded text-center"
                        >
                          Ep {ep}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'episodes' && movie.episodes === 1 && (
                  <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8">
                    <List size={48} className="text-purple-500 mb-4" />
                    <p className="text-white text-center">This is a single movie with no episodes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-blue-400">StreamFlix</h1>
          <div className="hidden md:flex space-x-4">
            <button className="hover:text-blue-400">Home</button>
            <button className="hover:text-blue-400">My List</button>
            <button className="hover:text-blue-400">Account</button>
          </div>
          <button className="md:hidden text-white">☰</button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="relative w-full h-48 md:h-96 bg-gradient-to-r from-purple-700 to-blue-700 rounded-lg mb-8 overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-center p-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Welcome to StreamFlix</h2>
            <p className="text-sm md:text-lg mb-4">Watch thousands of movies and TV shows</p>
            <button className="bg-red-600 hover:bg-red-700 text-white w-32 py-2 rounded-lg flex items-center justify-center">
              <Play size={16} className="mr-2" /> Watch Now
            </button>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                className={`${category.color} hover:opacity-90 rounded-lg p-6 text-center font-bold transition-transform transform hover:scale-105`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Selected Category Carousel */}
        {selectedCategory && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedCategory}</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => scrollLeft('carousel')}
                  className="bg-gray-800 hover:bg-gray-700 rounded-full p-1"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => scrollRight('carousel')}
                  className="bg-gray-800 hover:bg-gray-700 rounded-full p-1"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
            
            <div 
              id="carousel" 
              className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {movies[selectedCategory].map(movie => (
                <div 
                  key={movie.id}
                  className="flex-shrink-0 w-32 md:w-48 cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="w-full h-48 md:h-64 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-sm font-medium truncate">{movie.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Featured Movies */}
        {!selectedCategory && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Featured Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.Hollywood.slice(0, 5).map(movie => (
                <div 
                  key={movie.id}
                  className="cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="w-full h-48 md:h-64 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-sm font-medium truncate">{movie.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; 2025 StreamFlix. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Help Center</a>
          </div>
        </div>
      </footer>
      
      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
      
      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default VideoStreamingApp;