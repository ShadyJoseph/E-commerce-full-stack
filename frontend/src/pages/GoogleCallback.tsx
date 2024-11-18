// GoogleCallback.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setAuthToken, setUser } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const id = params.get('id');
    const email = params.get('email');
    const displayName = params.get('displayName');

    if (token && id && email && displayName) {
      setAuthToken(token);
      setUser({ id, email, displayName, role: 'user' }); // Default role: 'user'
      navigate('/');
    } else {
      console.error('Invalid callback parameters:', { token, id, email, displayName });
      navigate('/signin'); // Redirect to Sign In on failure
    }
  }, [navigate, setAuthToken, setUser]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
