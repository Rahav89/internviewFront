import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InternPage from './FFCompos/InternPage';
import Login from './FFCompos/Login';
import ProfileIntern from './FFCompos/ProfileIntern';
import { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TableFullSyllabus from './FFCompos/TableFullSyllabus';
import ViewInterns from './FFCompos/ViewInterns';
import '@fontsource/roboto/300.css';
import CardsDetailsInterns from './FFCompos/CardsDetailsInterns';


const theme = createTheme({
    typography: {
        fontFamily: 'Calibri',
    },
});

function App() {
    useEffect(() => {
        document.body.dir = "ltr";
        document.body.style.backgroundColor = theme.palette.background.default;
        document.body.style.color="black"
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/intern" element={<InternPage />} />
                    <Route path="/profile" element={<ProfileIntern />} />
                    <Route path="/TableFullSyllabus/:id" element={<TableFullSyllabus />} />
                    <Route path="/ViewInterns" element={<ViewInterns />} />
                    <Route path="/details/:id" element={<CardsDetailsInterns />} />
                   
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;

