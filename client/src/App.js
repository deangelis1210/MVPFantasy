import logo from './logo.svg';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import './App.css';
import Data from './Test'; 
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' exact Component={HomePage} />
          <Route path='/login' exact Component={LoginPage} />
          {/* <Route path='/about' exact Component={About} />
          <Route path='/contact' exact Component={Contact} />
          <Route path='/privacy-policy' exact Component={Privacy} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;

