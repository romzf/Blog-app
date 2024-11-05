// src/App.js
import './App.css';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Error from './pages/Error';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Movies from './pages/Movies';
import MovieDetails from './components/MovieDetails';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null,
        email: null,
        firstName: null,
        lastName: null,
        mobileNo: null,
    });

    const unsetUser = () => {
        localStorage.clear();
    };

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            const userDetails = parseJwt(token);
            if (userDetails) {
                setUser({
                    id: userDetails.id,
                    email: userDetails.email,
                });
            }
        }
    }, []);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router> {/* Wrap everything in Router */}
                <AppNavbar />
                <Content />
            </Router>
        </UserProvider>
    );
}


function Content() {
    
    return (
        <>
            <Container fluid className='banner'>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admindashboard" element={<AdminDashboard />} />
                    <Route path="/UserDashboard" element={<UserDashboard />} />
                    <Route path="/posts" element={<Movies />} />
                    <Route path="/posts/:id" element={<MovieDetails />} /> 
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
