// src/components/AppNavbar.js
import React, { useEffect, useState, useCallback }  from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import '../App.css';

export default function AppNavbar() {

    const [isAdmin, setIsAdmin] = useState(false);
    const token = localStorage.getItem('token');

    const fetchUserDetails = useCallback(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setIsAdmin(data.isAdmin);
            })
            .catch(err => {
                console.error('Error fetching user details:', err);
            });
    }, [token]);
    
    useEffect(() => {
        fetchUserDetails();
        
    }, [fetchUserDetails]);

    return (
        <Navbar id="navbar" bg="primary" expand="lg" className='sticky-top'>
            <Container fluid>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src="/logo.png"
                        alt="Home Logo"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
                        {localStorage.getItem('token') ? (
                            isAdmin ? (
                                <>
                                <Nav.Link as={NavLink} to="/admindashboard" exact="true">Admin Dashboard</Nav.Link>
                                <Nav.Link as={NavLink} to="/posts" exact="true">Posts</Nav.Link>
                                <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                                </>
                            ) : (
                                <>
                                <Nav.Link as={NavLink} to="/userdashboard" exact="true">User Dashboard</Nav.Link>
                                <Nav.Link as={NavLink} to="/posts" exact="true">Posts</Nav.Link>
                                <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                                </>
                            )
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
