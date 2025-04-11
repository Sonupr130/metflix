// import React from 'react';
// import { X, Play, Download, List } from 'lucide-react';

// const MovieDetails = ({ movie, onClose, darkMode }) => {
//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//       <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative`}>
//         <button
//           onClick={onClose}
//           className={`absolute right-4 top-4 p-2 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-full`}
//         >
//           <X size={24} className={darkMode ? 'text-white' : 'text-gray-900'} />
//         </button>

//         <div className="flex flex-col md:flex-row bg-red-500">
//           <img
//             src={movie.coverImage}
//             alt={movie.title}
//             className="w-full md:w-[300px] h-[400px] object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
//           />
          
//           {/* //right side */}
//           <div className="p-6 flex flex-col flex-1">
//             <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{movie.title}</h2>

//             <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//       {movie.description}
//     </p>
            
//             <div className="flex flex-col gap-4 mt-auto">
//               <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
//                 <Play size={20} />
//                 Watch Online
//               </button>
              
//               <button className="flex items-center justify-center gap-2 bg-amber-400 text-white py-3 px-6 rounded-lg hover:bg-amber-500 transition-colors">
//                 <Play size={20} />
//                 Download Link
//               </button>
              
//               <button className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
//                 <Download size={20} />
//                 Direct Download
//               </button>
              
//               {movie.episodes && (
//                 <button className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
//                   <List size={20} />
//                   View Episodes ({movie.episodes})
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieDetails;









import React from 'react';
import { X, Play, Download, List } from 'lucide-react';

const MovieDetails = ({ movie, onClose, darkMode }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative`}>
        <button
          onClick={onClose}
          className={`absolute right-4 top-4 p-2 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-full`}
        >
          <X size={24} className={darkMode ? 'text-white' : 'text-gray-900'} />
        </button>

        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg">
  {/* Left Side - Cover Image */}
  <div className="md:w-[300px] flex-shrink-0">
    <img
      src={movie.coverImage}
      alt={movie.title}
      className="w-full h-full max-h-[400px] md:max-h-none object-cover"
    />
  </div>
  
  {/* Right Side - Content */}
  <div className="p-6 flex flex-col flex-1">
    <div className="mb-4">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {movie.title}
      </h2>
      {movie.year && (
        <span className={`text-md ${darkMode ? 'text-gray-300' : 'text-purple-600'}`}>
          {movie.year}
        </span>
      )}
    </div>

    <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {movie.description}
    </p>
    
    {/* Buttons Container */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
      <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
        <Play size={18} />
        Watch Online
      </button>
      
      <button className="flex items-center justify-center gap-2 bg-amber-400 text-white py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors">
        <Play size={18} />
        Download Link
      </button>
      
      <button className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
        <Download size={18} />
        Direct Download
      </button>
      
      {movie.episodes && (
        <button className="flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
          <List size={18} />
          View Episodes ({movie.episodes})
        </button>
      )}
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default MovieDetails;