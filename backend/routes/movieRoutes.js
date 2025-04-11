import express from 'express';
import { addMovie, getAllMovies, searchMovies } from '../controllers/movieController.js';
import multer from 'multer';


const router = express.Router();


// Configure multer for file uploads
const upload = multer({
  dest: 'temp/uploads/',
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

// Add a new movie
router.post('/add-movie', upload.single('coverImage'), addMovie);
// Search movies
router.get('/movies/search', searchMovies);
// Get all movies
router.get('/movies', getAllMovies);

export default router; 

// value={searchTerm}
// onChange={(e) => handleSearchChange(e.target.value)}
// onFocus={() => searchTerm.length > 0 && setShowSearchResults(true)}
// onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
