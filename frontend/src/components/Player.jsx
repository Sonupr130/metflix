// import React, { useRef, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ReactPlayer from 'react-player';

// const Player = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const playerRef = useRef(null);
  
//   // Get stream URL and movie details from navigation state
//   const { streamUrl, movieDetails, fileInfo } = location.state || {};

//   if (!streamUrl) {
//     return (
//       <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
//         <div className="text-center">
//           <p>No video stream available</p>
//           <button
//             onClick={() => navigate('/')}
//             className="mt-4 px-4 py-2 bg-blue-600 rounded"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black">
//       <div className="absolute top-0 left-0 right-0 p-4 bg-black/50 z-10">
//         <h1 className="text-white text-xl font-bold truncate">
//           {movieDetails?.title || 'Now Playing'}
//         </h1>
//         {fileInfo && (
//           <p className="text-gray-300 text-sm">
//             {formatFileSize(fileInfo.size)} • {fileInfo.name}
//           </p>
//         )}
//       </div>
      
//       <div className="h-full w-full flex items-center justify-center">
//         <ReactPlayer
//           ref={playerRef}
//           url={`http://localhost:5000${streamUrl}`}
//           playing
//           controls
//           width="100%"
//           height="100%"
//           config={{
//             file: {
//               attributes: {
//                 controlsList: 'nodownload'
//               }
//             }
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// // Helper function to format file size
// function formatFileSize(bytes) {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
// }

// export default Player;






import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { X } from 'lucide-react';

const Player = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const [error, setError] = useState(null);
  const [bandwidthError, setBandwidthError] = useState(null);
  const [retryTime, setRetryTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { streamUrl, movieDetails, fileInfo } = location.state || {};

  // Check if mobile on component mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // 768px is a common breakpoint for mobile
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!streamUrl) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p>No video stream available</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleError = (err) => {
    console.error('Player error:', err);
    
    if (err.message.includes('Bandwidth limit reached')) {
      const match = err.message.match(/until it resets: (\d+) seconds/);
      if (match) {
        const seconds = parseInt(match[1]);
        setRetryTime(seconds);
        setBandwidthError(`MEGA bandwidth limit reached. Please wait ${formatTime(seconds)} or upgrade to MEGA Pro.`);
      } else {
        setBandwidthError('MEGA bandwidth limit reached. Please try again later.');
      }
    } else {
      setError('Failed to load video. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Function to truncate title for mobile
  const getDisplayTitle = () => {
    const title = movieDetails?.title || 'Now Playing';
    if (isMobile && title.length > 20) {
      return `${title.substring(0, 17)}...`;
    }
    return title;
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Back/Close Button - Larger touch target on mobile */}
      <button
        onClick={() => navigate(-1)}
        className={`absolute top-4 left-4 z-20 p-2 bg-black/70 hover:bg-black/90 rounded-full transition-colors ${
          isMobile ? 'p-3' : 'p-2'
        }`}
        aria-label="Close player"
      >
        <X className={`text-white rounded-full hover:bg-slate-900 ${
          isMobile ? 'w-8 h-8 p-1' : 'w-10 h-10 p-2'
        }`} />
      </button>

      {/* Video Info - Adjusted for mobile */}
      <div className={`absolute top-0 left-0 right-0 ${
        isMobile ? 'p-2' : 'p-4'
      } bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-center pointer-events-none`}>
        <div className={`text-center ${
          isMobile ? 'max-w-xs px-2' : 'max-w-3xl'
        }`}>
          <h1 className={`text-white font-bold truncate ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>
            {getDisplayTitle()}
          </h1>
          {fileInfo && (
            <p className={`text-gray-300 ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>
              {formatFileSize(fileInfo.size)} • {fileInfo.name}
            </p>
          )}
        </div>
      </div>
      
      {/* Error Messages (unchanged) */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/80">
          <div className="text-center p-4 bg-black/70 rounded-lg">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {bandwidthError && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/80">
          <div className={`text-center p-4 bg-black/70 rounded-lg ${
            isMobile ? 'max-w-xs' : 'max-w-md'
          }`}>
            <p className="text-red-400 mb-4">{bandwidthError}</p>
            {retryTime > 0 && (
              <p className="text-yellow-400 mb-4">
                Time remaining: {formatTime(retryTime)}
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Video Player */}
      <div className="h-full w-full flex items-center justify-center">
        <ReactPlayer
          ref={playerRef}
          url={`http://localhost:5000${streamUrl}`}
          playing
          controls
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          onError={handleError}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload noremoteplayback',
                disablePictureInPicture: true
              },
              forceVideo: true
            }
          }}
          playsinline
        />
      </div>
    </div>
  );
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default Player;