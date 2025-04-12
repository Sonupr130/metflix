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







import React, { useState } from 'react';
import { X, Play, Download, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const MovieDetails = ({ movie, onClose, darkMode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const handleWatchOnline = async () => {
    if (!movie.megaFileId) {
      toast.error('This movie has no associated video file');
      return;
    }

    setIsLoading(true);
    setVerificationStatus(null);

    try {
      // 1. Verify the file exists in MEGA storage
      const verifyResponse = await axios.get(
        `http://localhost:5000/api/verify-mega-file/${movie.megaFileId}`
      );

      if (!verifyResponse.data.exists) {
        toast.error('Video file not found in storage');
        setVerificationStatus('not_found');
        return;
      }

      if (!verifyResponse.data.isVideo) {
        toast.error('The associated file is not a video');
        setVerificationStatus('not_video');
        return;
      }

      // 2. If verification passed, navigate to player
      navigate('/player', {
        state: {
          streamUrl: verifyResponse.data.streamUrl,
          movieDetails: movie,
          fileInfo: verifyResponse.data
        }
      });

    } catch (error) {
      console.error('Playback error:', error);
      toast.error(error.response?.data?.error || 'Failed to verify video file');
    } finally {
      setIsLoading(false);
    }
  };




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
          <div className="md:w-[300px] flex-shrink-0">
            <img
              src={movie.coverImage}
              alt={movie.title}
              className="w-full h-full max-h-[400px] md:max-h-none object-cover"
            />
          </div>
          
          <div className="p-6 flex flex-col flex-1">
            <div className="mb-4">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {movie.title}
              </h2>
              {movie.year && (
                <span className={`text-md ${darkMode ? 'text-gray-300' : 'text-purple-600'}`}>
                  Released: {movie.year}
                </span>
              )}
            </div>

            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {movie.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
             <button 
            onClick={handleWatchOnline}
            disabled={isLoading || !movie.megaFileId}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors disabled:opacity-70 ${
              !movie.megaFileId ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Play size={18} />
                Watch Online
              </>
            )}
          </button>
              
              <button className="flex items-center justify-center gap-2 bg-amber-400 text-white py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors">
                <Play size={18} />
                Download Link
              </button>
              
              <button className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                <Download size={18} />
                Direct Download
              </button>
            </div>
          </div>
        </div>

          {/* Show verification status if available */}
          {verificationStatus === 'not_found' && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            Video file not found in storage
          </div>
        )}
        {verificationStatus === 'not_video' && (
          <div className="mt-4 p-2 bg-yellow-100 text-yellow-700 rounded">
            The associated file is not a video
          </div>
        )}
        {!movie.megaFileId && (
          <div className="mt-4 p-2 bg-yellow-100 text-yellow-700 rounded">
            This movie has no associated video file
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;









