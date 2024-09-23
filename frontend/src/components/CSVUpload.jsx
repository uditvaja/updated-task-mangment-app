import React, { useState } from 'react';
import axios from 'axios';

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);  // Capture the selected file
  };

  const url ='http://localhost:3000/api/tasks/import-csv'
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Please select a CSV file to upload.');
      return;
    }
  
    const formData = new FormData();
    formData.append('csvfile', file);
  
    const token = localStorage.getItem('token'); // or wherever you're storing the JWT token
  
    try {
      const response = await axios.post('http://localhost:3000/api/tasks/import-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,  // Include token in Authorization header
        },
      });
  
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error uploading file: ' + (error.response?.data.message || error.message));
    }
  };
  

  return (
    <div>
      <h2>Upload CSV File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CSVUpload;
