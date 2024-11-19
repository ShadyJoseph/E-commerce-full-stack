import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Loader from '../components/Loader';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setAuthToken, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const isProcessed = useRef(false);  // Ref to prevent reprocessing

  useEffect(() => {
    // Only process if not already done
    if (isProcessed.current) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const id = params.get('id');
    const email = params.get('email');
    const displayName = params.get('displayName');
    const role = params.get('role') || 'user'; // Default role is 'user'

    console.log('Callback Params:', { id, email, displayName, role });

    // Only process if all parameters are valid
    if (token && id && email && displayName) {
      try {
        console.log('Before state update:', { token, id, email, displayName, role });
        setAuthToken(token);
        setUser({ id, email, displayName, role });
        
        // Mark the processing as completed to prevent multiple triggers
        isProcessed.current = true;
        console.log('After state update:', { user: useAuthStore.getState().user });

        // No need for loading once state has been updated
        setLoading(false);
        console.log('Authentication successful, redirecting to home.');
        navigate('/'); // Redirect to homepage after successful authentication
      } catch (error) {
        console.error('Error processing Google callback:', error);
        navigate('/signin'); // In case of error, navigate to sign-in page
      }
    } else {
      console.error('Invalid or missing callback parameters:', { id, email, displayName, role });
      navigate(`/error?error=missing_params`);
    }
  }, [navigate, setAuthToken, setUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader height="80" width="80" color="#2b6cb0" />
      </div>
    );
  }

  return null; // In case of redirection, no need for further rendering
};

export default GoogleCallback;
