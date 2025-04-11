import React, { useState } from 'react';
import { Film, Link, Upload, Image, X, Check, Info, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const UploadMovie = () => {
  const [formData, setFormData] = useState({
    title: '',
    releaseYear: '',
    genre: '',
    director: '',
    cast: '',
    description: '',
    downloadLink: '',
    downloadType: 'direct',
  });

  const [poster, setPoster] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      setNotification({
        type: 'error',
        message: 'Please select a valid image file (JPEG, PNG, or WEBP)'
      });
      return;
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setNotification({
        type: 'error',
        message: 'Image size should be less than 2MB'
      });
      return;
    }

    setPoster(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.title || !formData.downloadLink || !poster) {
      setNotification({
        type: 'error',
        message: 'Please fill all required fields and upload a poster'
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call with FormData to handle file upload
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    submissionData.append('poster', poster);

    // Mock API call
    setTimeout(() => {
      console.log('Submitted data:', Object.fromEntries(submissionData));
      setIsSubmitting(false);
      setNotification({
        type: 'success',
        message: 'Movie successfully added!'
      });
      
      // Reset form
      setFormData({
        title: '',
        releaseYear: '',
        genre: '',
        director: '',
        cast: '',
        description: '',
        downloadLink: '',
        downloadType: 'direct',
      });
      setPoster(null);
      setPreviewUrl('');
      
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }, 1500);
  };

  const removeImage = () => {
    setPoster(null);
    setPreviewUrl('');
  };

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", 
    "Documentary", "Drama", "Fantasy", "Horror", "Mystery",
    "Romance", "Sci-Fi", "Thriller", "Western"
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <img src={logo} className="h-8 w-8 text-indigo-600 " />
          <h1 className="text-2xl font-bold text-gray-900">etflix Upload Portal</h1>
        </div>

        {notification && (
          <div className={`mb-6 p-4 rounded-md flex items-start ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {notification.type === 'success' ? (
              <Check className="h-5 w-5 mr-2 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 flex items-center">
              <Info className="h-5 w-5 mr-2 text-indigo-500" />
              Add New Movie
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Movie Details */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Movie Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-700">
                      Release Year
                    </label>
                    <input
                      type="number"
                      name="releaseYear"
                      id="releaseYear"
                      min="1900"
                      max="2099"
                      value={formData.releaseYear}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                      Genre
                    </label>
                    <select
                      name="genre"
                      id="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select genre</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="director" className="block text-sm font-medium text-gray-700">
                    Director
                  </label>
                  <input
                    type="text"
                    name="director"
                    id="director"
                    value={formData.director}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="cast" className="block text-sm font-medium text-gray-700">
                    Cast (comma separated)
                  </label>
                  <input
                    type="text"
                    name="cast"
                    id="cast"
                    value={formData.cast}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Actor 1, Actor 2, Actor 3"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Right Column - Poster and Download */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Movie Poster <span className="text-red-500">*</span>
                  </label>
                  
                  {!previewUrl ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="poster-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input 
                              id="poster-upload" 
                              name="poster-upload" 
                              type="file" 
                              accept="image/jpeg,image/png,image/webp" 
                              className="sr-only" 
                              onChange={handlePosterChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WEBP up to 2MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative mt-2 border rounded-md overflow-hidden" style={{ height: '280px' }}>
                      <img 
                        src={previewUrl} 
                        alt="Movie poster preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 focus:outline-none"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="downloadLink" className="block text-sm font-medium text-gray-700">
                    Download Link <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Link className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="downloadLink"
                        id="downloadLink"
                        value={formData.downloadLink}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
                        placeholder="https://example.com/movie.mp4"
                        required
                      />
                    </div>
                    <select
                      name="downloadType"
                      value={formData.downloadType}
                      onChange={handleChange}
                      className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                    >
                      <option value="direct">Direct</option>
                      <option value="torrent">Torrent</option>
                      <option value="magnet">Magnet</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Add Movie
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadMovie;