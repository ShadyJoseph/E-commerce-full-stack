import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loader from './components/Loader';

const NotFound = lazy(() => import('./pages/NotFound'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/Signup'));
const Home = lazy(() => import('./pages/Home'));
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const NoNavbarLayout = lazy(() => import('./layouts/NoNavbarLayout'));
const Profile = lazy(() => import('./pages/Profile'));
const Cart = lazy(() => import('./pages/Cart'));
const GoogleCallback = lazy(() => import('./pages/GoogleCallback'));
const ErrorPage = lazy(() => import('./pages/Error'));

function App() {

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
          <Route path="/google/callback" element={<MainLayout><GoogleCallback /></MainLayout>} />
          <Route path="/signin" element={<NoNavbarLayout><SignIn /></NoNavbarLayout>} />
          <Route path="/signup" element={<NoNavbarLayout><SignUp /></NoNavbarLayout>} />
          <Route path="/error" element={<NoNavbarLayout><ErrorPage/></NoNavbarLayout>} />
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
