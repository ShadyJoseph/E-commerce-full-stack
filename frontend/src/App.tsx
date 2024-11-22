import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import NoNavbarLayout from './layouts/NoNavbarLayout';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import GoogleCallback from './pages/GoogleCallback';
import ErrorPage from './pages/Error';

function App() {
  return (
    <Router>
      <div className="App">
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
      </div>
    </Router>
  );
}

export default App;
