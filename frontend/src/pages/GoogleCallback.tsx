import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setAuthToken, setUser } = useAuthStore();

  useEffect(() => {
    const url = window.location.href;
    console.log('Full Callback URL:', url);

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const id = params.get('id');
    const email = params.get('email');
    const displayName = params.get('displayName');

    console.log('Callback Params:', { token, id, email, displayName });

    if (token && id && email && displayName) {
      try {
        setAuthToken(token);
        setUser({ id, email, displayName, role: 'user' }); // Default role: 'user'
        navigate('/'); // Navigate to the homepage
      } catch (error) {
        console.error('Error processing Google callback:', error);
        navigate('/signin'); // Redirect to signin on failure
      }
    } else {
      // Log details to help identify why parameters are missing
      console.error('Invalid or missing callback parameters:', { token, id, email, displayName });
      
      // Redirect to a dedicated error page with query info for debugging
      const queryParams = new URLSearchParams({
        error: 'missing_params',
        token: token || '',
        id: id || '',
        email: email || '',
        displayName: displayName || '',
      }).toString();

      navigate(`/error?${queryParams}`);
    }
  }, [navigate, setAuthToken, setUser]);

  return <div>Loading...</div>; // Add a spinner or animation for better UX
};

export default GoogleCallback;
