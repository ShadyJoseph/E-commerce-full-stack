import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loader from './components/Loader';

// Lazy-load the pages and layouts
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
      <div className="App">
        <Suspense fallback={<div><Loader height="25" width="25" aria-label="Loading..." /></div>}>
          <Routes>
            <Route
              path="/home"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <MainLayout>
                  <Profile />
                </MainLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <MainLayout>
                  <Cart />
                </MainLayout>
              }
            />
            <Route
              path="/google/callback"
              element={
                <MainLayout>
                  <GoogleCallback />
                </MainLayout>
              }
            />

            {/* Routes without Navbar and footer */}
            <Route
              path="/signin"
              element={
                <NoNavbarLayout>
                  <SignIn />
                </NoNavbarLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <NoNavbarLayout>
                  <SignUp />
                </NoNavbarLayout>
              }
            />
            <Route
              path="/error"
              element={
                <MainLayout>
                  <ErrorPage />
                </MainLayout>
              }
            />
            <Route
              path="*"
              element={
                <MainLayout>
                  <NotFound />
                </MainLayout>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
