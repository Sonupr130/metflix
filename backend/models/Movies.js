import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
    trim: true
  },
  description: {
    type: String,
    // required: true,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'bollywood',
      'hollywood',
      'anime',
      'south',
      'web-series',
      'action',
      'comedy',
      'drama',
      'sci-fi',
      'horror',
      'romance',
      'Other'  // Added "Other" as an option
    ],
  },
  year: {
    type: Number,
    // required: true,
    min: 1900,
    max: new Date().getFullYear() + 5
  },
  directUrl: {
    type: String,
    // required: true,
    trim: true
  },
  coverImage: {
    type: String, // This will store the path to the image file
    // required: true
  },
  downloads:{
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;