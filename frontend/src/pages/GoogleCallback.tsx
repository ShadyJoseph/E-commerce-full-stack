import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../stores/slices/authSlice'; // Import the actions
import { setAuthToken } from '../api/auth'; // Auth token helper function
import Loader from '../components/Loader';
import { useAppDispatch } from '../hooks/reduxHooks';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const isProcessed = useRef(false); // Ref to prevent reprocessing

  useEffect(() => {
    if (isProcessed.current) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const id = params.get('id');
    const email = params.get('email');
    const displayName = params.get('displayName');
    const role = params.get('role') || 'user'; // Default role is 'user'

    console.log('Callback Params:', { id, email, displayName, role });

    if (token && id && email && displayName) {
      try {
        console.log('Before state update:', { token, id, email, displayName, role });

        // Set the token using the setAuthToken helper function
        setAuthToken(token);

        // Dispatch setUser to Redux store
        dispatch(setUser({ id, email, displayName, role }));

        // Mark the processing as completed to prevent multiple triggers
        isProcessed.current = true;
        console.log('After state update:', { user: id, email, displayName, role });

        setLoading(false);
        console.log('Authentication successful, redirecting to home.');
        navigate('/'); // Redirect to homepage after successful authentication
      } catch (error) {
        console.error('Error processing Google callback:', error);
        setLoading(false);
        navigate('/signin'); // In case of error, navigate to sign-in page
      }
    } else {
      console.error('Invalid or missing callback parameters:', { id, email, displayName, role });
      setLoading(false);
      navigate(`/error?error=missing_params`); // Provide a more user-friendly error page
    }
  }, [navigate, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader height="80" width="80" color="#2b6cb0" />
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
