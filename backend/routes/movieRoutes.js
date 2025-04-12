import express from 'express';
import { addMovie, getAllMovies, getMoviesByCategory, searchMovies } from '../controllers/movieController.js';
import multer from 'multer';
import Movie from '../models/Movies.js';


const router = express.Router();


// Configure multer for file uploads
// const upload = multer({
//   dest: 'temp/uploads/',
//   limits: {
//     fileSize: 2 * 1024 * 1024 // 2MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'), false);
//     }
//   }
// });

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});


router.post('/add-movie', upload.single('coverImage'), addMovie);   // Add a new movie
router.get('/movies/search', searchMovies);   // Search movies
router.get('/movies', getAllMovies);  // Get all movies
router.get('/movies/:category', getMoviesByCategory);

// Enhanced streaming endpoint with flexible matching
router.get('/movies/stream/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title);
    
    // 1. Verify movie exists in DB
    const movie = await Movie.findOne({ title: decodedTitle });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found in database' });
    }

    // 2. Normalize the search term (remove special characters, extra spaces)
    const normalizedSearchTerm = decodedTitle
      .replace(/[^\w\s.-]/g, '') // Remove special chars except dots and dashes
      .replace(/\s+/g, ' ')      // Collapse multiple spaces
      .trim()
      .toLowerCase();

    // 3. Search Mega Cloud for matching files
    const allFiles = await getAllFiles(storage.root);
    
    // Find the best matching file with flexible matching
    const bestMatch = findBestMatchingFile(allFiles, normalizedSearchTerm, decodedTitle);
    
    if (!bestMatch) {
      return res.status(404).json({ 
        message: 'File not found in storage',
        searchedTitle: decodedTitle,
        availableFiles: allFiles.map(f => f.name) // For debugging
      });
    }

    // 4. Return streaming URL
    const streamUrl = `/api/stream-file/${bestMatch.nodeId}`;
    res.json({ url: streamUrl });
    
  } catch (err) {
    console.error('Streaming error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Helper function for flexible filename matching
function findBestMatchingFile(files, normalizedSearchTerm, originalTitle) {
  // Score files based on match quality
  const scoredFiles = files.map(file => {
    const normalizedFilename = file.name
      .replace(/[^\w\s.-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    
    let score = 0;
    
    // Exact match gets highest priority
    if (normalizedFilename === normalizedSearchTerm) {
      score = 100;
    } 
    // Contains the full normalized search term
    else if (normalizedFilename.includes(normalizedSearchTerm)) {
      score = 80 + (normalizedSearchTerm.length / normalizedFilename.length * 20);
    }
    // Contains most of the words
    else {
      const searchWords = normalizedSearchTerm.split(' ');
      const filenameWords = normalizedFilename.split(' ');
      const matchingWords = searchWords.filter(word => 
        filenameWords.some(fw => fw.includes(word))
      );
      score = (matchingWords.length / searchWords.length) * 60;
    }
    
    return { file, score, originalName: file.name };
  });

  // Sort by score and return the best match
  scoredFiles.sort((a, b) => b.score - a.score);
  
  // Only return if we have a decent match (score > 30)
  return scoredFiles[0]?.score > 30 ? scoredFiles[0].file : null;
}



router.get('/player/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    // Render your player page with the movie details
    res.render('player', { movie });
  } catch (err) {
    console.error('Player error:', err);
    res.status(500).send(err.message);
  }
});


// Update the streaming endpoint
router.get('/movies/stream/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Find movie by ID in MongoDB
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // 2. If we have the MEGA file ID stored, use that
    if (movie.megaFileId) {
      const streamUrl = `/api/stream/${movie.megaFileId}`;
      return res.json({ url: streamUrl });
    }

    // 3. Fallback to title matching (only if megaFileId not available)
    const normalizedTitle = movie.title
      .replace(/[^\w\s.-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    const allFiles = await getAllFiles(storage.root);
    const bestMatch = findBestMatchingFile(allFiles, normalizedTitle, movie.title);
    
    if (!bestMatch) {
      return res.status(404).json({ message: 'File not found in storage' });
    }

    // 4. Optionally save the MEGA file ID for future use
    movie.megaFileId = bestMatch.nodeId;
    await movie.save();

    const streamUrl = `/api/stream/${bestMatch.nodeId}`;
    res.json({ url: streamUrl });
    
  } catch (err) {
    console.error('Streaming error:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router; 

