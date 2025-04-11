import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { FiDownload, FiFolder, FiFile, FiVideo, FiImage, FiMusic, FiCopy } from 'react-icons/fi';

const VideoPlayer = () => {
    const [files, setFiles] = useState([]);
    const [currentFile, setCurrentFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPath, setCurrentPath] = useState('');
    const playerRef = useRef(null);

    // Helper functions
    const isVideoFile = (fileName) => {
        if (!fileName) return false;
        const videoExtensions = ['.mp4', '.mkv', '.mov', '.avi', '.wmv', '.flv', '.webm'];
        return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    };

    const getFileIcon = (file) => {
        if (!file.type) return <FiFile className="text-gray-500" />;
        switch(file.type) {
            case 'video': return <FiVideo className="text-blue-500" />;
            case 'image': return <FiImage className="text-green-500" />;
            case 'audio': return <FiMusic className="text-purple-500" />;
            case 'pdf': return <FiFile className="text-red-500" />;
            default: return <FiFile className="text-gray-500" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Fetch files
    useEffect(() => {
        const fetchFiles = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/files');
                setFiles(response.data.files);
                setCurrentPath('Root');
            } catch (err) {
                setError('Failed to load files. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFiles();
    }, []);

    const handleFileClick = async (file) => {
        try {
            setIsLoading(true);
            setCurrentFile(file);
            
            console.log("Selected file:", file);

            if (file.type === 'video' || isVideoFile(file.name)) {
                const streamUrl = `http://localhost:5000/api/stream/${file.nodeId}`;
                setVideoUrl(streamUrl);
                console.log("Setting video URL:", streamUrl);
            } else {
                setVideoUrl('');
            }
        } catch (err) {
            setError('Failed to load file. Please try again.');
            console.error('Error loading file:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">MEGA Cloud Files</h1>
            
            {error && (
                <div className="p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* File Browser */}
                <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 bg-indigo-600 text-white">
                        <h2 className="font-semibold">File Browser</h2>
                        <p className="text-sm opacity-80">{currentPath}</p>
                    </div>
                    
                    {isLoading && !files.length ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-y-auto max-h-96">
                            {files.map((file) => (
                                <div 
                                    key={file.nodeId}
                                    onClick={() => handleFileClick(file)}
                                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${currentFile?.nodeId === file.nodeId ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="text-xl">
                                        {getFileIcon(file)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{file.name}</p>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{file.type || 'file'}</span>
                                            <span>{formatFileSize(file.size)}</span>
                                        </div>
                                    </div>
                                    <a 
                                        href={file.downloadUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1 text-gray-400 hover:text-indigo-600"
                                    >
                                        <FiDownload />
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Preview Panel */}
                <div className="w-full lg:w-2/3">
                    {currentFile ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                            <div className="p-4 bg-indigo-600 text-white">
                                <h2 className="font-semibold">File Details</h2>
                                <p className="text-sm opacity-80 truncate">{currentFile.name}</p>
                            </div>
                            
                            <div className="flex-1 overflow-auto">
                                {(currentFile.type === 'video' || isVideoFile(currentFile.name)) ? (
                                    <div className="relative pt-[56.25%] bg-black">
                                        {isLoading ? (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                            </div>
                                        ) : (
                                            <ReactPlayer
                                                ref={playerRef}
                                                url={videoUrl}
                                                controls
                                                width="100%"
                                                height="100%"
                                                style={{ position: 'absolute', top: 0, left: 0 }}
                                                config={{
                                                    file: {
                                                        attributes: { controlsList: 'nodownload' },
                                                        forceVideo: true
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-6">
                                        <div className="flex items-start gap-6">
                                            <div className="text-6xl text-indigo-100 bg-indigo-50 p-4 rounded-lg">
                                                {getFileIcon(currentFile)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-medium mb-2">{currentFile.name}</h3>
                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Type</p>
                                                        <p>{currentFile.type || 'file'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Size</p>
                                                        <p>{formatFileSize(currentFile.size)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Created</p>
                                                        <p>{new Date(currentFile.createdAt * 1000).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Location</p>
                                                        <p className="truncate">{currentFile.path || 'Root'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-3">
                                                    <a 
                                                        href={currentFile.downloadUrl}
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                                                    >
                                                        <FiDownload /> Download
                                                    </a>
                                                    <button 
                                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                                                        onClick={() => navigator.clipboard.writeText(currentFile.downloadUrl)}
                                                    >
                                                        <FiCopy /> Copy Link
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center h-full flex items-center justify-center">
                            <div>
                                <FiFolder className="text-6xl text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Select a file to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;