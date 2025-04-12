// import express from 'express';
// import dotenv from 'dotenv';
// import { Storage, File } from 'megajs';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import mongoose from 'mongoose';
// import moviesRoutes from "./routes/movieRoutes.js"
// import authRoutes from "./routes/authRoutes.js"
// import path from 'path';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://sonupradhan:pradhan82@metflix.ilped1r.mongodb.net/?retryWrites=true&w=majority&appName=metflix')
// .then(() => console.log('Connected to MongoDB 🔥'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Initialize MEGA storage
// let storage;




// async function initializeMega() {
//   try {
//     storage = new Storage({
//       email: process.env.MEGA_EMAIL,
//       password: process.env.MEGA_PASSWORD,
//       autologin: true,
//       autoload: true
//     });

//     await storage.ready;
//     console.log('Connected to MEGA successfully');
//     console.log('Account:', storage.name);
//     return true;
//   } catch (error) {
//     console.error('MEGA initialization error:', error);
//     throw error;
//   }
// }

// // Helper function to determine file type by extension
// function getFileType(filename) {
//   if (!filename) return 'file';
//   const ext = filename.split('.').pop().toLowerCase();
//   const videoExts = ['mp4', 'mkv', 'mov', 'avi', 'wmv', 'flv', 'webm'];
//   const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
//   const audioExts = ['mp3', 'wav', 'ogg', 'flac'];
//   const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  
//   if (videoExts.includes(ext)) return 'video';
//   if (imageExts.includes(ext)) return 'image';
//   if (audioExts.includes(ext)) return 'audio';
//   if (documentExts.includes(ext)) return 'document';
//   return 'file';
// }

// // Helper function to get MIME type
// function getMimeType(filename) {
//   const ext = filename.split('.').pop().toLowerCase();
//   const mimeTypes = {
//     // Video
//     mp4: 'video/mp4',
//     mkv: 'video/x-matroska',
//     mov: 'video/quicktime',
//     avi: 'video/x-msvideo',
//     webm: 'video/webm',
//     // Audio
//     mp3: 'audio/mpeg',
//     wav: 'audio/wav',
//     ogg: 'audio/ogg',
//     flac: 'audio/flac',
//     // Images
//     jpg: 'image/jpeg',
//     jpeg: 'image/jpeg',
//     png: 'image/png',
//     gif: 'image/gif',
//     webp: 'image/webp',
//     // Documents
//     pdf: 'application/pdf',
//     doc: 'application/msword',
//     docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     xls: 'application/vnd.ms-excel',
//     xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     ppt: 'application/vnd.ms-powerpoint',
//     pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//     txt: 'text/plain'
//   };
//   return mimeTypes[ext] || 'application/octet-stream';
// }

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// // app.use('/public', express.static(path.join(__dirname, 'public')));

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     megaConnected: !!storage,
//     account: storage ? storage.name : null
//   });
// });

// app.use('/api', moviesRoutes);
// app.use('/api/v1/auth', authRoutes);

// // Get file by ID endpoint
// app.get('/api/files/:fileId', async (req, res) => {
//   try {
//     if (!storage) {
//       return res.status(503).json({ error: 'MEGA storage not initialized' });
//     }

//     const { fileId } = req.params;
//     const file = storage.root.find(file => file.nodeId === fileId, true);
    
//     if (!file) {
//       return res.status(404).json({ error: 'File not found' });
//     }

//     const fileInfo = {
//       name: file.name,
//       size: file.size,
//       type: getFileType(file.name),
//       mimeType: getMimeType(file.name),
//       nodeId: file.nodeId,
//       path: await getPath(file),
//       createdAt: file.timestamp,
//       downloadUrl: `https://mega.nz/file/${file.nodeId}`,
//       directStreamUrl: `/api/stream/${file.nodeId}`
//     };

//     res.json(fileInfo);
//   } catch (error) {
//     console.error('Error fetching file:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Helper function to get file path
// async function getPath(file) {
//   let path = [];
//   let current = file;
//   while (current && current.parent) {
//     path.unshift(current.name);
//     current = current.parent;
//   }
//   return path.join('/');
// }

// // Get all files endpoint with filtering
// app.get('/api/files', async (req, res) => {
//   try {
//     if (!storage) {
//       return res.status(503).json({ error: 'MEGA storage not initialized' });
//     }

//     async function getAllFiles(folder) {
//       const files = [];
//       const children = await folder.children;
      
//       for (const child of children) {
//         if (child.directory) {
//           const folderFiles = await getAllFiles(child);
//           files.push(...folderFiles);
//         } else {
//           files.push({
//             name: child.name,
//             size: child.size,
//             type: getFileType(child.name),
//             mimeType: getMimeType(child.name),
//             nodeId: child.nodeId,
//             path: await getPath(child),
//             createdAt: child.timestamp,
//             downloadUrl: `https://mega.nz/file/${child.nodeId}`,
//             directStreamUrl: `/api/stream/${child.nodeId}`
//           });
//         }
//       }
//       return files;
//     }

//     const allFiles = await getAllFiles(storage.root);
//     const { type, name } = req.query;
//     let filteredFiles = allFiles;
    
//     if (type) {
//       filteredFiles = allFiles.filter(file => file.type === type);
//     }
    
//     if (name) {
//       filteredFiles = filteredFiles.filter(file => 
//         file.name.toLowerCase().includes(name.toLowerCase())
//       );
//     }

//     res.json({
//       count: filteredFiles.length,
//       files: filteredFiles
//     });
    
//   } catch (error) {
//     console.error('Error fetching files:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// const bandwidthCache = new Map();

// // Streaming endpoint with improved chunk handling
// app.get('/api/stream/:fileId', async (req, res) => {
//   try {
//     if (!storage) {
//       return res.status(503).send('MEGA storage not initialized');
//     }

//     // Check bandwidth limits
//     const now = Date.now();
//     const lastReset = bandwidthCache.get('lastReset') || 0;
//     const usedBandwidth = bandwidthCache.get('usedBandwidth') || 0;
    
//     // Reset counter if 6 hours have passed (MEGA's free limit period)
//     if (now - lastReset > 6 * 60 * 60 * 1000) {
//       bandwidthCache.set('usedBandwidth', 0);
//       bandwidthCache.set('lastReset', now);
//     }

//     // MEGA free account limit is ~5GB per 6 hours
//     if (usedBandwidth > 5 * 1024 * 1024 * 1024) {
//       return res.status(429).json({
//         error: 'Bandwidth limit reached',
//         retryAfter: Math.ceil((lastReset + 6 * 60 * 60 * 1000 - now) / 1000)
//       });
//     }

//     const { fileId } = req.params;
//     const file = storage.root.find(file => file.nodeId === fileId, true);
//     if (!file) {
//       return res.status(404).send('File not found');
//     }

//     const contentType = getMimeType(file.name);
//     const fileSize = file.size;
//     const range = req.headers.range;

//     const headers = {
//       'Content-Type': contentType,
//       'Accept-Ranges': 'bytes',
//       'Cache-Control': 'no-cache',
//       'Connection': 'keep-alive'
//     };

//     if (range) {
//       const parts = range.replace(/bytes=/, '').split('-');
//       const start = parseInt(parts[0], 10);
//       const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//       const chunkSize = (end - start) + 1;

//       if (start >= fileSize || end >= fileSize) {
//         return res.status(416).header({
//           'Content-Range': `bytes */${fileSize}`
//         }).send('Requested range not satisfiable');
//       }

//       headers['Content-Range'] = `bytes ${start}-${end}/${fileSize}`;
//       headers['Content-Length'] = chunkSize;
//       res.writeHead(206, headers);

//       // Track bandwidth usage
//       bandwidthCache.set('usedBandwidth', usedBandwidth + chunkSize);

//       const downloadStream = file.download({ start, end, returnCiphertext: false });
      
//       downloadStream.on('error', (err) => {
//         console.error('Stream error:', err);
//         if (!res.headersSent) {
//           res.status(500).send('Stream error');
//         }
//       });
      
//       downloadStream.pipe(res);
//     } else {
//       headers['Content-Length'] = fileSize;
//       res.writeHead(200, headers);
      
//       // Track bandwidth usage
//       bandwidthCache.set('usedBandwidth', usedBandwidth + fileSize);

//       const downloadStream = file.download({ returnCiphertext: false });
//       downloadStream.on('error', (err) => {
//         console.error('Stream error:', err);
//         if (!res.headersSent) {
//           res.status(500).send('Stream error');
//         }
//       });
//       downloadStream.pipe(res);
//     }
//   } catch (error) {
//     console.error('Streaming error:', error);
//     if (!res.headersSent) {
//       res.status(500).send(error.message);
//     }
//   }
// });
// // Search for files by name with pagination
// app.get('/api/files/search', async (req, res) => {
//   try {
//     if (!storage) {
//       return res.status(503).json({ error: 'MEGA storage not initialized' });
//     }

//     const { name, type, page = 1, limit = 20 } = req.query;
    
//     if (!name && !type) {
//       return res.status(400).json({ error: 'Search term or file type is required' });
//     }

//     async function searchFiles(folder, searchTerm, fileType) {
//       const results = [];
//       const children = await folder.children;
      
//       for (const child of children) {
//         if (child.directory) {
//           const folderResults = await searchFiles(child, searchTerm, fileType);
//           results.push(...folderResults);
//         } else {
//           const matchesName = !searchTerm || child.name.toLowerCase().includes(searchTerm.toLowerCase());
//           const matchesType = !fileType || getFileType(child.name) === fileType;
          
//           if (matchesName && matchesType) {
//             results.push({
//               name: child.name,
//               size: child.size,
//               type: getFileType(child.name),
//               mimeType: getMimeType(child.name),
//               nodeId: child.nodeId,
//               path: await getPath(child),
//               createdAt: child.timestamp,
//               downloadUrl: `https://mega.nz/file/${child.nodeId}`,
//               directStreamUrl: `/api/stream/${child.nodeId}`
//             });
//           }
//         }
//       }
//       return results;
//     }

//     const allResults = await searchFiles(storage.root, name, type);
    
//     // Pagination
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     const paginatedResults = allResults.slice(startIndex, endIndex);
    
//     res.json({
//       total: allResults.length,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       totalPages: Math.ceil(allResults.length / limit),
//       files: paginatedResults
//     });
    
//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/verify-mega-file/:megaFileId', async (req, res) => {
//   try {
//     if (!storage) {
//       return res.status(503).json({ error: 'MEGA storage not initialized' });
//     }

//     const { megaFileId } = req.params;

//     // 1. Find the file in MEGA storage
//     const file = storage.root.find(file => file.nodeId === megaFileId, true);
    
//     if (!file) {
//       return res.status(404).json({ 
//         exists: false,
//         message: 'File not found in MEGA storage' 
//       });
//     }

//     // 2. Verify it's a video file
//     const fileType = getFileType(file.name);
//     if (fileType !== 'video') {
//       return res.status(400).json({ 
//         exists: true,
//         isVideo: false,
//         message: 'The file is not a video' 
//       });
//     }

//     // 3. Return success with streaming URL
//     res.json({
//       exists: true,
//       isVideo: true,
//       name: file.name,
//       size: file.size,
//       streamUrl: `/api/stream/${file.nodeId}`
//     });

//   } catch (error) {
//     console.error('Verification error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });





// // Initialize and start server
// initializeMega()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   })
//   .catch(error => {
//     console.error('Failed to initialize MEGA connection:', error);
//     process.exit(1);
//   });

















/**
 * METFLIX STREAMING SERVER
 * Main server file handling MEGA integration, API routes, and video streaming
 */

// ======================
// 1. INITIAL SETUP & IMPORTS
// ======================
import express from 'express';
import dotenv from 'dotenv';
import { Storage } from 'megajs'; // MEGA cloud storage integration
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose'; // MongoDB integration
import moviesRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// ======================
// 2. DATABASE CONNECTIONS
// ======================

/**
 * MongoDB Connection
 * - Connects to MongoDB Atlas cluster
 * - Uses connection string from environment variables
 */
mongoose.connect('mongodb+srv://sonupradhan:pradhan82@metflix.ilped1r.mongodb.net/?retryWrites=true&w=majority&appName=metflix')
  .then(() => console.log('🔥 Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// MEGA Storage instance (initialized later)
let storage;

// Bandwidth tracking cache for MEGA free account limits
const bandwidthCache = new Map();

// ======================
// 3. MEGA STORAGE INTEGRATION
// ======================

/**
 * Initializes MEGA storage connection
 * - Uses credentials from environment variables
 * - Sets up auto-login and auto-load
 */
async function initializeMega() {
  try {
    storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
      autologin: true,
      autoload: true
    });

    await storage.ready;
    console.log('☁️ Connected to MEGA successfully');
    console.log('   Account:', storage.name);
    return true;
  } catch (error) {
    console.error('MEGA initialization error:', error);
    throw error;
  }
}

// ======================
// 4. HELPER FUNCTIONS
// ======================

/**
 * Determines file type based on extension
 * @param {string} filename 
 * @returns {string} File type (video, image, audio, document, or file)
 */
function getFileType(filename) {
  if (!filename) return 'file';
  const ext = filename.split('.').pop().toLowerCase();
  
  const videoExts = ['mp4', 'mkv', 'mov', 'avi', 'wmv', 'flv', 'webm'];
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac'];
  const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  
  if (videoExts.includes(ext)) return 'video';
  if (imageExts.includes(ext)) return 'image';
  if (audioExts.includes(ext)) return 'audio';
  if (documentExts.includes(ext)) return 'document';
  return 'file';
}

/**
 * Gets MIME type based on file extension
 * @param {string} filename 
 * @returns {string} Corresponding MIME type
 */
function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const mimeTypes = {
    // Video
    mp4: 'video/mp4',
    mkv: 'video/x-matroska',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    webm: 'video/webm',
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Gets full path of a file in MEGA storage
 * @param {Object} file - MEGA file object
 * @returns {string} Full path as string
 */
async function getPath(file) {
  let path = [];
  let current = file;
  while (current && current.parent) {
    path.unshift(current.name);
    current = current.parent;
  }
  return path.join('/');
}

// ======================
// 5. MIDDLEWARE SETUP
// ======================

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true, // Allow cookies
}));

// Body parsers
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For form data

// Cookie parser
app.use(cookieParser());

// ======================
// 6. ROUTES
// ======================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    megaConnected: !!storage,
    account: storage ? storage.name : null
  });
});

// Mount route modules
app.use('/api', moviesRoutes); // Movie-related routes
app.use('/api/v1/auth', authRoutes); // Authentication routes

// ======================
// 7. MEGA FILE OPERATIONS
// ======================

/**
 * Get file by ID
 * - Returns metadata about a specific file
 */
app.get('/api/files/:fileId', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'MEGA storage not initialized' });
    }

    const { fileId } = req.params;
    const file = storage.root.find(file => file.nodeId === fileId, true);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileInfo = {
      name: file.name,
      size: file.size,
      type: getFileType(file.name),
      mimeType: getMimeType(file.name),
      nodeId: file.nodeId,
      path: await getPath(file),
      createdAt: file.timestamp,
      downloadUrl: `https://mega.nz/file/${file.nodeId}`,
      directStreamUrl: `/api/stream/${file.nodeId}`
    };

    res.json(fileInfo);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all files with filtering
 * - Supports type and name filters
 * - Recursively scans MEGA storage
 */
app.get('/api/files', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'MEGA storage not initialized' });
    }

    async function getAllFiles(folder) {
      const files = [];
      const children = await folder.children;
      
      for (const child of children) {
        if (child.directory) {
          const folderFiles = await getAllFiles(child);
          files.push(...folderFiles);
        } else {
          files.push({
            name: child.name,
            size: child.size,
            type: getFileType(child.name),
            mimeType: getMimeType(child.name),
            nodeId: child.nodeId,
            path: await getPath(child),
            createdAt: child.timestamp,
            downloadUrl: `https://mega.nz/file/${child.nodeId}`,
            directStreamUrl: `/api/stream/${child.nodeId}`
          });
        }
      }
      return files;
    }

    const allFiles = await getAllFiles(storage.root);
    const { type, name } = req.query;
    let filteredFiles = allFiles;
    
    if (type) filteredFiles = allFiles.filter(file => file.type === type);
    if (name) filteredFiles = filteredFiles.filter(file => 
      file.name.toLowerCase().includes(name.toLowerCase())
    );

    res.json({
      count: filteredFiles.length,
      files: filteredFiles
    });
    
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: error.message });
  }
});

// ======================
// 8. VIDEO STREAMING ENDPOINT
// ======================

/**
 * Video streaming endpoint
 * - Handles range requests for seeking
 * - Tracks bandwidth usage for MEGA free account limits
 * - Supports both full file and partial content requests
 */
app.get('/api/stream/:fileId', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).send('MEGA storage not initialized');
    }

    // Bandwidth limit check (5GB per 6 hours for free accounts)
    const now = Date.now();
    const lastReset = bandwidthCache.get('lastReset') || 0;
    const usedBandwidth = bandwidthCache.get('usedBandwidth') || 0;
    
    // Reset counter if 6 hours have passed
    if (now - lastReset > 6 * 60 * 60 * 1000) {
      bandwidthCache.set('usedBandwidth', 0);
      bandwidthCache.set('lastReset', now);
    }

    // Check if bandwidth limit reached
    if (usedBandwidth > 5 * 1024 * 1024 * 1024) {
      return res.status(429).json({
        error: 'Bandwidth limit reached',
        retryAfter: Math.ceil((lastReset + 6 * 60 * 60 * 1000 - now) / 1000)
      });
    }

    const { fileId } = req.params;
    const file = storage.root.find(file => file.nodeId === fileId, true);
    if (!file) {
      return res.status(404).send('File not found');
    }

    const contentType = getMimeType(file.name);
    const fileSize = file.size;
    const range = req.headers.range;

    const headers = {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    };

    // Handle range requests (for video seeking)
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;

      if (start >= fileSize || end >= fileSize) {
        return res.status(416).header({
          'Content-Range': `bytes */${fileSize}`
        }).send('Requested range not satisfiable');
      }

      headers['Content-Range'] = `bytes ${start}-${end}/${fileSize}`;
      headers['Content-Length'] = chunkSize;
      res.writeHead(206, headers);

      // Track bandwidth usage
      bandwidthCache.set('usedBandwidth', usedBandwidth + chunkSize);

      const downloadStream = file.download({ start, end, returnCiphertext: false });
      
      downloadStream.on('error', (err) => {
        console.error('Stream error:', err);
        if (!res.headersSent) res.status(500).send('Stream error');
      });
      
      downloadStream.pipe(res);
    } 
    // Full file request
    else {
      headers['Content-Length'] = fileSize;
      res.writeHead(200, headers);
      
      // Track bandwidth usage
      bandwidthCache.set('usedBandwidth', usedBandwidth + fileSize);

      const downloadStream = file.download({ returnCiphertext: false });
      downloadStream.on('error', (err) => {
        console.error('Stream error:', err);
        if (!res.headersSent) res.status(500).send('Stream error');
      });
      downloadStream.pipe(res);
    }
  } catch (error) {
    console.error('Streaming error:', error);
    if (!res.headersSent) res.status(500).send(error.message);
  }
});

// ======================
// 9. SEARCH & VERIFICATION
// ======================

/**
 * Search files by name/type with pagination
 */
app.get('/api/files/search', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'MEGA storage not initialized' });
    }

    const { name, type, page = 1, limit = 20 } = req.query;
    
    if (!name && !type) {
      return res.status(400).json({ error: 'Search term or file type is required' });
    }

    async function searchFiles(folder, searchTerm, fileType) {
      const results = [];
      const children = await folder.children;
      
      for (const child of children) {
        if (child.directory) {
          const folderResults = await searchFiles(child, searchTerm, fileType);
          results.push(...folderResults);
        } else {
          const matchesName = !searchTerm || child.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesType = !fileType || getFileType(child.name) === fileType;
          
          if (matchesName && matchesType) {
            results.push({
              name: child.name,
              size: child.size,
              type: getFileType(child.name),
              mimeType: getMimeType(child.name),
              nodeId: child.nodeId,
              path: await getPath(child),
              createdAt: child.timestamp,
              downloadUrl: `https://mega.nz/file/${child.nodeId}`,
              directStreamUrl: `/api/stream/${child.nodeId}`
            });
          }
        }
      }
      return results;
    }

    const allResults = await searchFiles(storage.root, name, type);
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = allResults.slice(startIndex, endIndex);
    
    res.json({
      total: allResults.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(allResults.length / limit),
      files: paginatedResults
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Verify MEGA file exists and is a video
 */
app.get('/api/verify-mega-file/:megaFileId', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'MEGA storage not initialized' });
    }

    const { megaFileId } = req.params;
    const file = storage.root.find(file => file.nodeId === megaFileId, true);
    
    if (!file) {
      return res.status(404).json({ 
        exists: false,
        message: 'File not found in MEGA storage' 
      });
    }

    // Verify it's a video file
    const fileType = getFileType(file.name);
    if (fileType !== 'video') {
      return res.status(400).json({ 
        exists: true,
        isVideo: false,
        message: 'The file is not a video' 
      });
    }

    res.json({
      exists: true,
      isVideo: true,
      name: file.name,
      size: file.size,
      streamUrl: `/api/stream/${file.nodeId}`
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ======================
// 10. SERVER INITIALIZATION
// ======================

/**
 * Start the server after initializing MEGA connection
 */
initializeMega()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('❌ Failed to initialize MEGA connection:', error);
    process.exit(1);
  });