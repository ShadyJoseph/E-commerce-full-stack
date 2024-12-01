import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../stores/slices/authSlice';
import { setAuthToken } from '../api/auth';
import Loader from '../components/Loader';
import { useAppDispatch } from '../hooks/reduxHooks';
import { User } from '../stores/slices/authSlice';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const id = params.get('id');
    const email = params.get('email');
    const displayName = params.get('displayName');
    const role = params.get('role') || 'user';

    if (token && id && email && displayName) {
      try {
        setAuthToken(token);

        const user: User = { id, email, displayName, role };
        dispatch(setUser({ user, token }));

        isProcessed.current = true;
        navigate('/');
      } catch (error) {
        console.error('Error processing Google callback:', error);
        navigate('/signin?error=auth_failed');
      } finally {
        setLoading(false);
      }
    } else {
      console.error('Missing callback parameters');
      setLoading(false);
      navigate(`/error?error=missing_params`);
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
