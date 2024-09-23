import axios from 'axios';
import './AlltaskList'
const ExportTasksButton = () => {
  const exportTasks = async () => {
    const token = localStorage.getItem('token'); // Fetch the token from localStorage

    try {
      const response = await axios.get('http://localhost:3000/api/tasks/export-csv', {
        headers: {
          'Authorization': `Bearer ${token}`, // Set the JWT token in Authorization header
        },
        responseType: 'blob', // Important to receive the file
      });

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks.csv'); // Name of the downloaded file
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting tasks:', error);
      alert('Error exporting tasks.');
    }
  };

  return <button className="btn-create" onClick={exportTasks}>Download Tasks</button>;
};

export default ExportTasksButton;
