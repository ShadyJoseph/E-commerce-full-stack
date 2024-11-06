import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

interface UserResponse {
  displayname: string;
}

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get<UserResponse>('/dashboard');
        setUsername(response.data.displayname);
      } catch (error) {
        console.error('Failed to fetch user data');
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div>
      <h1>{username}</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default Dashboard;
