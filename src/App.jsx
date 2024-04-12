import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import InternPage from './FFCompos/InternPage';
import Login from './FFCompos/Login';
import ProfileIntern from './FFCompos/ProfileIntern';
import { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TableFullSyllabus from './FFCompos/TableFullSyllabus';

// const theme = createTheme({
//     palette: {
//         background: {
//             default: 'white'
//         },
//     },
// });

function App() {
    useEffect(() => {
        document.body.dir = "ltr"; // Set the direction to right-to-left
    //     document.body.style.backgroundColor = theme.palette.background.default;
    }, []);
    return (
        // <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/intern" element={<InternPage />} />
                    <Route path="/profile" element={<ProfileIntern />} />
                    <Route path="/TableFullSyllabus" element={<TableFullSyllabus />} />
                </Routes>
            </Router>
        // </ThemeProvider>
    );
}

export default App;

