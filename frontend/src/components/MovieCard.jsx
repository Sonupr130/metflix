import React from 'react';
import { Play } from 'lucide-react';

const MovieCard = ({ title, image, onClick, darkMode }) => {
  return (
    <div 
      onClick={onClick}
      className="relative flex-shrink-0 w-[200px] md:w-[280px] group cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <img 
        src={image} 
        alt={title} 
        className="w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
          <Play className="text-white mt-2" size={24} />
        </div>
      </div>
    </div>
  );
}

export default MovieCard;