import express from 'express';
import { addMovie, getAllMovies, getMoviesByCategory, searchMovies } from '../controllers/movieController.js';
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


router.post('/add-movie', upload.single('coverImage'), addMovie);   // Add a new movie
router.get('/movies/search', searchMovies);   // Search movies
router.get('/movies', getAllMovies);  // Get all movies
router.get('/movies/:category', getMoviesByCategory);

export default router; 

