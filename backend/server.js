// import express from 'express';
// import dotenv from 'dotenv';
// import { Storage, File } from 'megajs';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

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
  
//   if (videoExts.includes(ext)) return 'video';
//   if (imageExts.includes(ext)) return 'image';
//   if (audioExts.includes(ext)) return 'audio';
//   if (ext === 'pdf') return 'pdf';
//   return 'file';
// }

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     megaConnected: !!storage,
//     account: storage ? storage.name : null
//   });
// });

// // Get all files endpoint
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
//             nodeId: child.nodeId,
//             path: await getPath(child),
//             createdAt: child.timestamp,
//             downloadUrl: `https://mega.nz/file/${child.nodeId}`
//           });
//         }
//       }
//       return files;
//     }

//     async function getPath(file) {
//       let path = [];
//       let current = file;
//       while (current && current.parent) {
//         path.unshift(current.name);
//         current = current.parent;
//       }
//       return path.join('/');
//     }

//     const allFiles = await getAllFiles(storage.root);
//     const fileType = req.query.type;
//     let filteredFiles = allFiles;
    
//     if (fileType) {
//       filteredFiles = allFiles.filter(file => file.type === fileType);
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

// // Streaming endpoint with improved chunk handling
// app.get('/api/stream/:fileId', async (req, res) => {
//   try {
//     if (!storage) {
//       return res.status(503).send('MEGA storage not initialized');
//     }

//     const { fileId } = req.params;
//     const file = storage.root.find(file => file.nodeId === fileId, true);
//     if (!file) {
//       return res.status(404).send('File not found');
//     }

//     // Get file extension for proper content type
//     const fileExt = file.name.split('.').pop().toLowerCase();
//     const mimeTypes = {
//       mp4: 'video/mp4',
//       mkv: 'video/x-matroska',
//       mov: 'video/quicktime',
//       avi: 'video/x-msvideo',
//       webm: 'video/webm'
//     };
//     const contentType = mimeTypes[fileExt] || 'application/octet-stream';

//     const fileSize = file.size;
//     const range = req.headers.range;

//     if (range) {
//       // Parse Range header
//       const parts = range.replace(/bytes=/, '').split('-');
//       const start = parseInt(parts[0], 10);
//       const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
//       // Ensure we don't request beyond file size
//       const endAdjusted = Math.min(end, fileSize - 1);
//       const chunkSize = (endAdjusted - start) + 1;

//       // Set response headers for partial content
//       res.writeHead(206, {
//         'Content-Range': `bytes ${start}-${endAdjusted}/${fileSize}`,
//         'Accept-Ranges': 'bytes',
//         'Content-Length': chunkSize,
//         'Content-Type': contentType
//       });

//       // Create download stream for the specific range
//       const downloadStream = file.download({
//         start,
//         end: endAdjusted,
//         returnCiphertext: false
//       });

//       // Pipe the stream to response
//       downloadStream.pipe(res);
//     } else {
//       // If no range header, send the whole file (not recommended for large files)
//       res.writeHead(200, {
//         'Content-Length': fileSize,
//         'Content-Type': contentType
//       });
      
//       const downloadStream = file.download({ returnCiphertext: false });
//       downloadStream.pipe(res);
//     }
//   } catch (error) {
//     console.error('Streaming error:', error);
//     if (!res.headersSent) {
//       res.status(500).send(error.message);
//     }
//   }
// });



// // Search for files by name
// app.get('/api/files/search', async (req, res) => {
//   try {
//     if (!storage) {
//       return res.status(503).json({ error: 'MEGA storage not initialized' });
//     }

//     const { name } = req.query;
//     if (!name) {
//       return res.status(400).json({ error: 'File name is required' });
//     }

//     async function searchFiles(folder, searchTerm) {
//       const results = [];
//       const children = await folder.children;
      
//       for (const child of children) {
//         if (child.directory) {
//           const folderResults = await searchFiles(child, searchTerm);
//           results.push(...folderResults);
//         } else if (child.name.toLowerCase().includes(searchTerm.toLowerCase())) {
//           results.push({
//             name: child.name,
//             size: child.size,
//             type: getFileType(child.name),
//             nodeId: child.nodeId,
//             path: await getPath(child),
//             createdAt: child.timestamp,
//             downloadUrl: `https://mega.nz/file/${child.nodeId}`
//           });
//         }
//       }
//       return results;
//     }

//     const foundFiles = await searchFiles(storage.root, name);
    
//     res.json({
//       count: foundFiles.length,
//       files: foundFiles
//     });
    
//   } catch (error) {
//     console.error('Search error:', error);
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













import express from 'express';
import dotenv from 'dotenv';
import { Storage, File } from 'megajs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import moviesRoutes from "./routes/movieRoutes.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://sonupradhan:pradhan82@metflix.ilped1r.mongodb.net/?retryWrites=true&w=majority&appName=metflix')
.then(() => console.log('Connected to MongoDB 🔥'))
.catch(err => console.error('MongoDB connection error:', err));

// Initialize MEGA storage
let storage;

async function initializeMega() {
  try {
    storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
      autologin: true,
      autoload: true
    });

    await storage.ready;
    console.log('Connected to MEGA successfully');
    console.log('Account:', storage.name);
    return true;
  } catch (error) {
    console.error('MEGA initialization error:', error);
    throw error;
  }
}

// Helper function to determine file type by extension
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

// Helper function to get MIME type
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

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use('/public', express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    megaConnected: !!storage,
    account: storage ? storage.name : null
  });
});

app.use('/api', moviesRoutes);
app.use('/api/v1/auth', authRoutes);

// Get file by ID endpoint
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

// Helper function to get file path
async function getPath(file) {
  let path = [];
  let current = file;
  while (current && current.parent) {
    path.unshift(current.name);
    current = current.parent;
  }
  return path.join('/');
}

// Get all files endpoint with filtering
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
    
    if (type) {
      filteredFiles = allFiles.filter(file => file.type === type);
    }
    
    if (name) {
      filteredFiles = filteredFiles.filter(file => 
        file.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    res.json({
      count: filteredFiles.length,
      files: filteredFiles
    });
    
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: error.message });
  }
});

// Streaming endpoint with improved chunk handling
app.get('/api/stream/:fileId', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).send('MEGA storage not initialized');
    }

    const { fileId } = req.params;
    const file = storage.root.find(file => file.nodeId === fileId, true);
    if (!file) {
      return res.status(404).send('File not found');
    }

    const contentType = getMimeType(file.name);
    const fileSize = file.size;
    const range = req.headers.range;

    if (range) {
      // Parse Range header
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      // Ensure we don't request beyond file size
      const endAdjusted = Math.min(end, fileSize - 1);
      const chunkSize = (endAdjusted - start) + 1;

      // Set response headers for partial content
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${endAdjusted}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType
      });

      // Create download stream for the specific range
      const downloadStream = file.download({
        start,
        end: endAdjusted,
        returnCiphertext: false
      });

      // Pipe the stream to response
      downloadStream.pipe(res);
    } else {
      // If no range header, send the whole file (not recommended for large files)
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType
      });
      
      const downloadStream = file.download({ returnCiphertext: false });
      downloadStream.pipe(res);
    }
  } catch (error) {
    console.error('Streaming error:', error);
    if (!res.headersSent) {
      res.status(500).send(error.message);
    }
  }
});

// Search for files by name with pagination
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

// Initialize and start server
initializeMega()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize MEGA connection:', error);
    process.exit(1);
  });