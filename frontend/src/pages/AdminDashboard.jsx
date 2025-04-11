import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Home,
  Film,
  Users,
  Settings,
  BarChart2,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  PlusCircle,
  Grid,
  List,
  AlertCircle,
  Download,
  Image,
  FileText,
  Folder,
  Link,
  XCircle,
} from "lucide-react";
import ReactPlayer from "react-player";
import {
  FiDownload,
  FiFolder,
  FiFile,
  FiVideo,
  FiImage,
  FiMusic,
  FiCopy,
  FiSearch,
} from "react-icons/fi";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    category: "",
    year: "",
    directUrl: "",
    coverImage: null,    // For file upload
    coverImageUrl: "",   // For URL
    coverImagePreview: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // ------------------------------------------------------------------
  const [files, setFiles] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPath, setCurrentPath] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("");
  const playerRef = useRef(null);

  // Helper functions
  const isVideoFile = (fileName) => {
    if (!fileName) return false;
    const videoExtensions = [
      ".mp4",
      ".mkv",
      ".mov",
      ".avi",
      ".wmv",
      ".flv",
      ".webm",
    ];
    return videoExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  const getFileIcon = (file) => {
    if (!file.type) return <FiFile className="text-gray-500" />;
    switch (file.type) {
      case "video":
        return <FiVideo className="text-blue-500" />;
      case "image":
        return <FiImage className="text-green-500" />;
      case "audio":
        return <FiMusic className="text-purple-500" />;
      case "document":
        return <FiFile className="text-red-500" />;
      default:
        return <FiFile className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Fetch files with search and filters
  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      let url = "http://localhost:5000/api/files";
      const params = {};

      if (searchTerm) params.name = searchTerm;
      if (fileTypeFilter) params.type = fileTypeFilter;

      const response = await axios.get(url, { params });
      setFiles(response.data.files);
      setCurrentPath("Root");
      setError(null);
    } catch (err) {
      setError("Failed to load files. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = async (term) => {
    setSearchTerm(term);
    if (term.length > 0) {
      try {
        const response = await axios.get("http://localhost:5000/api/files", {
          params: { name: term },
        });
        setSearchResults(response.data.files);
        setShowSearchResults(true);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchFiles();
  }, [fileTypeFilter]);

  const handleFileClick = async (file) => {
    try {
      setIsLoading(true);
      setCurrentFile(file);

      if (file.type === "video" || isVideoFile(file.name)) {
        const streamUrl = `http://localhost:5000/api/stream/${file.nodeId}`;
        setVideoUrl(streamUrl);
      } else {
        setVideoUrl("");
      }
    } catch (err) {
      setError("Failed to load file. Please try again.");
      console.error("Error loading file:", err);
    } finally {
      setIsLoading(false);
    }
  };


  // ------------------------------------------------------------------

  // Mock data for statistics
  const stats = [
    {
      title: "Total Movies",
      value: "3,721",
      trend: "+5%",
      color: "bg-indigo-500",
    },
    {
      title: "Active Users",
      value: "8,402",
      trend: "+12%",
      color: "bg-green-500",
    },
    { title: "Downloads", value: "47,125", trend: "+8%", color: "bg-blue-500" },
    {
      title: "Available Space",
      value: "2.1 TB",
      trend: "-3%",
      color: "bg-purple-500",
    },
  ];

  // Mock data for recent movies
  const [movies, setMovies] = useState([]);

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios("http://localhost:5000/api/movies");
        setMovies(response.data); // Use response.data instead of just response
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]); // Set to empty array if there's an error
      }
    };
  
    fetchMovies();
  }, []);

  // Function to get default values for missing fields
  const getMovieWithDefaults = (movie) => {
    return {
      id: movie._id || Math.random().toString(36).substr(2, 9),
      title: movie.title || 'Untitled Movie',
      genre: movie.category || 'Unknown Genre',
      year: movie.year || 'Unknown Year',
      downloads: movie.downloads || 0, 
      status: 'active', // Default status
      coverImage: movie.coverImage 
    };
  };

  // Mock data for alerts
  const alerts = [
    {
      id: 1,
      message: "Storage space running low",
      level: "warning",
      time: "2 hours ago",
    },
    {
      id: 2,
      message: "5 failed login attempts detected",
      level: "error",
      time: "4 hours ago",
    },
    {
      id: 3,
      message: "Weekly backup completed successfully",
      level: "success",
      time: "12 hours ago",
    },
  ];

  const navigation = [
    { name: "Overview", icon: Home, current: currentSection === "overview" },
    { name: "Movies", icon: Film, current: currentSection === "movies" },
    { name: "Users", icon: Users, current: currentSection === "users" },
    {
      name: "Analytics",
      icon: BarChart2,
      current: currentSection === "analytics",
    },
    {
      name: "Settings",
      icon: Settings,
      current: currentSection === "settings",
    },
  ];

  const handleNavigation = (section) => {
    setCurrentSection(section.toLowerCase());
    setSidebarOpen(false);
  };

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Mock API call - in a real app, you would call your backend or a movie API
    const mockApiResults = [
      { id: "tt0111161", title: "The Shawshank Redemption", year: "1994" },
      { id: "tt0068646", title: "The Godfather", year: "1972" },
      { id: "tt0071562", title: "The Godfather: Part II", year: "1974" },
      { id: "tt0468569", title: "The Dark Knight", year: "2008" },
      { id: "tt0050083", title: "12 Angry Men", year: "1957" },
      { id: "tt0108052", title: "Schindler's List", year: "1993" },
      {
        id: "tt0167260",
        title: "The Lord of the Rings: The Return of the King",
        year: "2003",
      },
      { id: "tt0110912", title: "Pulp Fiction", year: "1994" },
    ].filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockApiResults);
  };

  // const handleAddMovie = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formData = new FormData();

  //     // Append values or 'Not Available' if undefined/null/empty
  //     formData.append("title", newMovie.title || "Not Available");
  //     formData.append("description", newMovie.description || "Not Available");
  //     formData.append("category", newMovie.category || "Not Available");
  //     formData.append("year", newMovie.year || "Not Available");
  //     formData.append("directUrl", newMovie.directUrl || "Not Available");

  //     // if (newMovie.coverImageFile) {
  //     //   formData.append('coverImage', newMovie.coverImageFile);
  //     // } else {
  //     //   // Optionally handle missing cover image
  //     //   alert('Please select a cover image');
  //     //   return;
  //     // }

  //     // Using axios for the request (make sure to import axios)
  //     const response = await axios.post(
  //       "http://localhost:5000/api/add-movie",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     console.log("Movie added:", response.data);

  //     // Reset form and close modal
  //     setShowAddMovieModal(false);
  //     setNewMovie({
  //       title: "",
  //       description: "",
  //       category: "",
  //       year: "",
  //       directUrl: "",
  //       coverImageFile: null,
  //       coverImagePreview: "",
  //     });
  //     setSearchTerm("");

  //     // Show success message
  //     alert("Movie added successfully!");
  //   } catch (error) {
  //     console.error("Error adding movie:", error);
  //     alert(
  //       `Error: ${
  //         error.response?.data?.error || error.message || "Failed to add movie"
  //       }`
  //     );
  //   }
  // };



  // const handleAddMovie = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     const formData = new FormData();
  
  //     // Append all fields
  //     formData.append("title", newMovie.title || "Not Available");
  //     formData.append("description", newMovie.description || "Not Available");
  //     formData.append("category", newMovie.category || "Not Available");
  //     formData.append("year", newMovie.year || "Not Available");
  //     formData.append("directUrl", newMovie.directUrl || "Not Available");
      
  //     // Append cover image URL if provided
  //     if (newMovie.coverImageUrl) {
  //       formData.append("coverImageUrl", newMovie.coverImageUrl);
  //     }
      
  //     // Append file if uploaded
  //     if (newMovie.coverImageFile) {
  //       formData.append('coverImage', newMovie.coverImageFile);
  //     }
  
  //     const response = await axios.post(
  //       "http://localhost:5000/api/add-movie",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  
  //     console.log("Movie added:", response.data);
  //     // Reset form and show success message...
  //   } catch (error) {
  //     console.error("Error adding movie:", error);
  //     alert(
  //       `Error: ${
  //         error.response?.data?.error || error.message || "Failed to add movie"
  //       }`
  //     );
  //   }
  // };


  const handleAddMovie = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
  
      // Append all fields
      formData.append("title", newMovie.title || "Not Available");
      formData.append("description", newMovie.description || "Not Available");
      formData.append("category", newMovie.category || "Not Available");
      formData.append("year", newMovie.year || "Not Available");
      formData.append("directUrl", newMovie.directUrl || "Not Available");
      
      // Append cover image URL if provided
      if (newMovie.coverImageUrl) {
        formData.append("coverImageUrl", newMovie.coverImageUrl);
      }
      
      // Append file if uploaded
      if (newMovie.coverImageFile) {
        formData.append('coverImage', newMovie.coverImageFile);
      }
  
      const response = await axios.post(
        "http://localhost:5000/api/add-movie",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Movie added:", response.data);
      
      // Show success toast
      toast.success("Movie added successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      // Close modal and reset form
      setShowAddMovieModal(false);
      setNewMovie({
        title: "",
        description: "",
        category: "",
        year: "",
        directUrl: "",
        coverImageFile: null,
        coverImagePreview: "",
        coverImageUrl: ""
      });
  
      // Optional: Refresh movies list
      const moviesResponse = await axios.get("http://localhost:5000/api/movies");
      setMovies(moviesResponse.data);
  
    } catch (error) {
      console.error("Error adding movie:", error);
      // Show error toast
      toast.error(
        error.response?.data?.error || error.message || "Failed to add movie",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMovie({
          ...newMovie,
          coverImage: file,
          coverImagePreview: reader.result,
          coverImageFile: file,
        coverImageUrl: "" // Clear URL if file is selected
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewMovie({
      ...newMovie,
      coverImage: null,
      coverImagePreview: "",
    });
  };

  const renderMainContent = () => {
    switch (currentSection) {
      case "overview":
        return renderOverview();
      case "movies":
        return renderMovies();
      default:
        return (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium">
              The "{currentSection}" section is under development
            </h3>
            <p className="mt-2 text-gray-500">
              This feature will be available soon.
            </p>
          </div>
        );
    }
  };

  const renderOverview = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}
                >
                  {index === 0 && <Film className="h-6 w-6 text-white" />}
                  {index === 1 && <Users className="h-6 w-6 text-white" />}
                  {index === 2 && <Download className="h-6 w-6 text-white" />}
                  {index === 3 && <BarChart2 className="h-6 w-6 text-white" />}
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-sm ${
                    stat.trend.includes("+") ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.trend} from last month
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Recent Movies</h3>
              <button
                onClick={() => handleNavigation("Movies")}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                View all
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Genre
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Year
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Downloads
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
      {movies.slice(0, 5).map((movie) => {
        const movieWithDefaults = getMovieWithDefaults(movie);
        return (
          <tr key={movieWithDefaults.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {movieWithDefaults.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {movieWithDefaults.genre}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {movieWithDefaults.year}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {movieWithDefaults.downloads}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {movieWithDefaults.status}
              </span>
            </td>
          </tr>
        );
      })}
    </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Recent Alerts</h3>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-gray-200">
                {alerts.map((alert) => (
                  <li key={alert.id} className="py-4">
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          alert.level === "error"
                            ? "bg-red-100"
                            : alert.level === "warning"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                        }`}
                      >
                        <AlertCircle
                          className={`h-5 w-5 ${
                            alert.level === "error"
                              ? "text-red-600"
                              : alert.level === "warning"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {alert.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderMovies = () => {
    return (
      <>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search movies..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowAddMovieModal(true)}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Movie
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {movies.map((movie) => {
    const movieWithDefaults = getMovieWithDefaults(movie);
    return (
      <div
        key={movieWithDefaults.id}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="h-48 bg-gray-200 relative">
          <img
            src={movieWithDefaults.coverImage || "https://user-images.githubusercontent.com/582516/98960633-6c6a1600-24e3-11eb-89f1-045f55a1e494.png"}
            alt="cover image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900">{movieWithDefaults.title}</h3>
          <div className="mt-2 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {movieWithDefaults.genre} • {movieWithDefaults.year}
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {movieWithDefaults.status}
            </span>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            {/* Only show downloads if greater than 0 */}
            {movieWithDefaults.downloads > 0 ? (
              <span>{movieWithDefaults.downloads} downloads</span>
            ) : (
              <span className="text-gray-400">No downloads yet</span>
            )}
            <button className="text-indigo-600 hover:text-indigo-800 font-medium">
              Edit
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {movies.map((movie) => (
                <li key={movie.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-indigo-600 truncate">
                            {movie.title}
                          </p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            ({movie.year})
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>
                              {movie.genre} • {movie.downloads} downloads
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0">
                        <div className="flex space-x-4">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {movie.status}
                          </span>
                          <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add Movie Modal */}
        {showAddMovieModal && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
                onClick={() => {
                  setShowAddMovieModal(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              {/* Modal content */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Add New Movie
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => {
                            setShowAddMovieModal(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      {error && (
                        <div className="p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700">
                          <p>{error}</p>
                        </div>
                      )}

                      <div className="mt-4">
                        <form onSubmit={handleAddMovie}>
                          {/* Cover Image Upload */}
                          {/* <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cover Image
                            </label>
                            {newMovie.coverImagePreview ? (
                              <div className="relative">
                                <img
                                  src={newMovie.coverImagePreview}
                                  alt="Cover preview"
                                  className="h-48 w-full object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={removeImage}
                                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                                >
                                  <XCircle className="h-5 w-5 text-red-500" />
                                </button>
                              </div>
                            ) : (
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                  <div className="flex text-sm text-gray-600 justify-center">
                                    <label
                                      htmlFor="cover-image"
                                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                    >
                                      <span>Upload an image</span>
                                      <input
                                        id="cover-image"
                                        name="coverImage" // Changed to match the server expectation
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required // Make it required as per your server code
                                      />
                                    </label>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG up to 2MB
                                  </p>
                                </div>
                              </div>
                            )}
                          </div> */}

                          <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Cover Image
    </label>
    
    {/* Image Preview */}
    {newMovie.coverImagePreview || newMovie.coverImageUrl ? (
      <div className="relative">
        <img
          src={newMovie.coverImagePreview || newMovie.coverImageUrl}
          alt="Cover preview"
          className="h-48 w-full object-cover rounded-md"
        />
        <button
          type="button"
          onClick={() => {
            setNewMovie({
              ...newMovie,
              coverImagePreview: "",
              coverImageUrl: "",
              coverImageFile: null
            });
          }}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
        >
          <XCircle className="h-5 w-5 text-red-500" />
        </button>
      </div>
    ) : (
      <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded-md">
        <span className="text-gray-500">No cover image selected</span>
      </div>
    )}

    {/* File Upload */}
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Cover Image
      </label>
      <div className="flex items-center">
        <label className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
          <span>Select File</span>
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
        <span className="ml-2 text-sm text-gray-500">
          {newMovie.coverImageFile ? newMovie.coverImageFile.name : "No file chosen"}
        </span>
      </div>
    </div>

    {/* OR divider */}
    <div className="flex items-center my-4">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="mx-2 text-sm text-gray-500">OR</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>

    {/* Cover Image URL */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cover Image URL
      </label>
      <input
        type="url"
        value={newMovie.coverImageUrl}
        onChange={(e) => {
          setNewMovie({
            ...newMovie,
            coverImageUrl: e.target.value,
            coverImageFile: null,
            coverImagePreview: ""
          });
        }}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="https://example.com/image.jpg"
      />
    </div>
  </div>


                          {/* Movie Title (not search) */}
                          <div className="mb-4 relative">
                            <div className="mb-4 relative">
                              <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Title
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  id="title"
                                  name="title"
                                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  placeholder="Enter movie title"
                                  value={searchTerm}
                                  onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setNewMovie({
                                      ...newMovie,
                                      title: e.target.value, // Update the title in newMovie state
                                    });
                                    handleSearchChange(e.target.value);
                                  }}
                                  onFocus={() =>
                                    searchTerm.length > 0 &&
                                    setShowSearchResults(true)
                                  }
                                  onBlur={() =>
                                    setTimeout(
                                      () => setShowSearchResults(false),
                                      200
                                    )
                                  }
                                  required
                                />
                                {showSearchResults &&
                                  searchResults.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                      {searchResults.map((file) => (
                                        <div
                                          key={file.nodeId}
                                          className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                                          onClick={() => {
                                            handleFileClick(file);
                                            setSearchTerm(file.name);
                                            setNewMovie({
                                              ...newMovie,
                                              title: file.name, // Update the title in newMovie state
                                            });
                                            setShowSearchResults(false);
                                          }}
                                        >
                                          <div className="text-xl">
                                            {getFileIcon(file)}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                              {file.name}
                                            </p>
                                            <div className="flex justify-between text-xs text-gray-500">
                                              <span>{file.type || "file"}</span>
                                              <span>
                                                {formatFileSize(file.size)}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>

                          {/* Rest of your form remains the same */}
                          {/* Description */}
                          <div className="mb-4">
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              rows={3}
                              value={newMovie.description}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  description: e.target.value,
                                })
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>

                          {/* Category and Year */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Category
                              </label>
                              <select
                                id="category"
                                name="category"
                                value={newMovie.category}
                                onChange={(e) =>
                                  setNewMovie({
                                    ...newMovie,
                                    category: e.target.value,
                                  })
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                              >
                                <option value="">Select a category</option>
                                <option value="bollywood">Bollywood</option>
                                <option value="hollywood">Hollywood</option>
                                <option value="anime">Anime</option>
                                <option value="south">South</option>
                                <option value="web-series">Web Series</option>
                                <option value="action">Action</option>
                                <option value="comedy">Comedy</option>
                                <option value="drama">Drama</option>
                                <option value="sci-fi">Sci-Fi</option>
                                <option value="horror">Horror</option>
                                <option value="romance">Romance</option>
                              </select>
                            </div>
                            <div>
                              <label
                                htmlFor="year"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Year
                              </label>
                              <input
                                type="number"
                                id="year"
                                name="year"
                                min="1900"
                                max="2099"
                                value={newMovie.year}
                                onChange={(e) =>
                                  setNewMovie({
                                    ...newMovie,
                                    year: e.target.value,
                                  })
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          {/* Direct URL */}
                          <div className="mb-4">
                            <label
                              htmlFor="directUrl"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Direct URL Link
                            </label>
                            <input
                              type="url"
                              id="directUrl"
                              name="directUrl"
                              value={newMovie.directUrl}
                              onChange={(e) =>
                                setNewMovie({
                                  ...newMovie,
                                  directUrl: e.target.value,
                                })
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button
                              type="submit"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                            >
                              Add Movie
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddMovieModal(false);
                                setNewMovie({
                                  title: "",
                                  description: "",
                                  category: "",
                                  year: "",
                                  directUrl: "",
                                  coverImageFile: null,
                                  coverImagePreview: "",
                                });
                              }}
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        role="dialog"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Film className="h-8 w-8 text-white" />
              <span className="ml-2 text-white text-xl font-medium">
                MovieAdmin
              </span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  onClick={() => handleNavigation(item.name)}
                  className={`${
                    item.current
                      ? "bg-indigo-900 text-white"
                      : "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75"
                  } cursor-pointer group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon className="mr-4 h-6 w-6 text-indigo-300" />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-900 p-4">
            <a href="#" className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-10 w-10 rounded-full"
                    src="/api/placeholder/40/40"
                    alt="Admin avatar"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">Admin User</p>
                  <p className="text-sm font-medium text-indigo-200 group-hover:text-white">
                    Logout
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 bg-indigo-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Film className="h-8 w-8 text-white" />
                <span className="ml-2 text-white text-xl font-medium">
                  MovieAdmin
                </span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    onClick={() => handleNavigation(item.name)}
                    className={`${
                      item.current
                        ? "bg-indigo-900 text-white"
                        : "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75"
                    } cursor-pointer group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon className="mr-3 h-6 w-6 text-indigo-300" />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-900 p-4">
              <a href="#" className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src="/api/placeholder/40/40"
                      alt="Admin avatar"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <div className="flex items-center text-xs font-medium text-indigo-200 group-hover:text-white">
                      <LogOut className="mr-1 h-4 w-4" />
                      Logout
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <h1 className="text-xl font-semibold text-gray-800 self-center">
                {currentSection.charAt(0).toUpperCase() +
                  currentSection.slice(1)}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="/api/placeholder/32/32"
                      alt="User avatar"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {renderMainContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
