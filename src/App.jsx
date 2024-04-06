import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import InternPage from './FFCompos/InternPage';
import Login from './FFCompos/Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/intern" element={<InternPage />} />
            </Routes>
        </Router>
    );
}

export default App;

