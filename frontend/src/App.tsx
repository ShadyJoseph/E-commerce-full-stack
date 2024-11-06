import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NotFound from './pages/NotFound';
import Signin from './pages/Sigin';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/dashboard" element={< Dashboard/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
