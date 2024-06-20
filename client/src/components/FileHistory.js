import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FileDownload from './FileDownload';
import socket from '../services/socket';

const FileHistory = ({ receiverIp }) => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchFileHistory = async () => {
      try {
        const response = await api.get(`/api/files/history/${receiverIp}`);
        setFiles(response.data.files);
      } catch (error) {
        console.error('Error fetching file history:', error);
      }
    };

    fetchFileHistory();

    // Listen for file uploads
    socket.on('fileUpload', (newFile) => {
      setFiles((prevFiles) => [...prevFiles, newFile]);
    });

    // Listen for file deletions
    socket.on('fileDelete', (deletedFileIds) => {
      setFiles((prevFiles) => prevFiles.filter(file => !deletedFileIds.includes(file.id)));
    });

    // Cleanup on unmount
    return () => {
      socket.off('fileUpload');
      socket.off('fileDelete');
    };
  }, [receiverIp]);

  const handleCheckboxChange = (fileId) => {
    const updatedSelectedFiles = selectedFiles.includes(fileId)
      ? selectedFiles.filter((id) => id !== fileId)
      : [...selectedFiles, fileId];
    setSelectedFiles(updatedSelectedFiles);
  };

  const handleDelete = async () => {
    try {
      await api.delete('/api/files/delete', { data: { fileIds: selectedFiles } });
      // After successful deletion, update the file list
      const response = await api.get(`/api/files/history/${receiverIp}`);
      setFiles(response.data.files);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };

  return (
    <div>
      <h2>File History</h2>
      <button onClick={handleDelete} disabled={selectedFiles.length === 0}>
        Delete Selected Files
      </button>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <input
              type="checkbox"
              checked={selectedFiles.includes(file.id)}
              onChange={() => handleCheckboxChange(file.id)}
            />
            {file.originalName} - {new Date(file.createdAt).toLocaleString()}
            <FileDownload uniqueName={file.uniqueName} originalName={file.originalName} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileHistory;
