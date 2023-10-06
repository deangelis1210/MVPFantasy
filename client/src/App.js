import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import './App.css';
import SignUpPage from './components/pages/SignUpPage';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' exact Component={LoginPage} />
          <Route path='/home' exact Component={HomePage} />
          <Route path='/signup' exact Component={SignUpPage} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
