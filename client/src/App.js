import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import TeamPage from './components/pages/TeamPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <LoginPage />}
        />
        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/" />}
        />
        <Route path="/signup" element={<SignUpPage />} />

        <Route
          path="/team"
          element={user ? <TeamPage /> : <Navigate to="/" />}
        />

      </Routes>
    </Router>
  );
}

export default App;
