import Movie from '../models/Movies.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure upload directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
 
// Add a new movie ORIGINLA CONTROLLER
// export const addMovie = async (req, res) => {
//   try {
//     const { title, description, category, year, directUrl } = req.body;
    
//     // Handle file upload
//     let coverImagePath = '';
//     // if (req.file) {
//     //   const fileExt = path.extname(req.file.originalname);
//     //   const fileName = `${Date.now()}${fileExt}`;
//     //   coverImagePath = `/uploads/${fileName}`;
      
//     //   // Move the file to uploads directory
//     //   fs.renameSync(req.file.path, path.join(uploadDir, fileName));
//     // } else {
//     //   return res.status(400).json({ error: 'Cover image is required' });
//     // }

//     const movie = new Movie({
//       title,
//       description,
//       category,
//       year,
//       directUrl,
//       coverImage: coverImagePath
//     });

//     await movie.save();
//     res.status(201).json(movie);
//   } catch (error) {
//     console.error('Error adding movie:', error);
//     res.status(500).json({ error: 'Failed to add movie' });
//   }
// };



export const addMovie = async (req, res) => {
  try {
    const { title, description, category, year, directUrl, coverImageUrl } = req.body;
    
    let coverImagePath = '';
    
    // Handle file upload if exists
    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${Date.now()}${fileExt}`;
      coverImagePath = `/uploads/${fileName}`;
      
      // Move the file to uploads directory
      fs.renameSync(req.file.path, path.join(uploadDir, fileName));
    } 
    // Use URL if provided and no file was uploaded
    else if (coverImageUrl) {
      coverImagePath = coverImageUrl;
    }
    // Default image if neither file nor URL provided
    else {
      coverImagePath = 'https://user-images.githubusercontent.com/582516/98960633-6c6a1600-24e3-11eb-89f1-045f55a1e494.png'; // Your default image path
    }

    const movie = new Movie({
      title,
      description,
      category,
      year,
      directUrl,
      coverImage: coverImagePath
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
};



// Search movies
export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const movies = await Movie.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } })
     .limit(10);

    res.json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'Failed to search movies' });
  }
};

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

// get movies by category
export const getMoviesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const movies = await Movie.find(query).sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};