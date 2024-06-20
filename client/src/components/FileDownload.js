// client/src/components/FileDownload.js

import React from 'react';
import api from '../services/api';

const FileDownload = ({ uniqueName, originalName }) => {
  const handleDownload = async () => {
    try {
      const response = await api.get(`/api/files/download/${uniqueName}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <button onClick={handleDownload}>Download</button>
  );
};

export default FileDownload;
