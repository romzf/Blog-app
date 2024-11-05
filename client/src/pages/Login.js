// pages/Login.js
import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../UserContext';
import '../App.css';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    const authenticate = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.access) {
                    // Store token and retrieve user details
                    localStorage.setItem('token', data.access);
                    const userDetails = parseJwt(data.access); // Parse JWT for user info
                    localStorage.setItem('userId', userDetails.id);
                    localStorage.setItem('username', userDetails.username);
                    
                    setUser({
                        id: userDetails.id,
                        username: userDetails.username,
                        email: userDetails.email,
                    }); // Update user context state

                    setEmail('');
                    setPassword('');
                    notyf.success('You are now logged in');
                } else if (data.message === "No email found") {   
                    notyf.error("No account found with this email");
                } else if (data.message === "Incorrect email or password") {
                    notyf.error("Incorrect email or password");
                } else if (data.message === 'Invalid email format') {
                    notyf.error("Please enter a valid email address");
                } else {
                    notyf.error("An error occurred. Please try again.");
                }
            })
            .catch(() => notyf.error("Network error. Please try again later."));
    };

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    return (
        user.id !== null ? 
        <Navigate to="/movies" />
        :
        <div className="container d-flex justify-content-center pt-5" style={{ minHeight: '350px' }}>
            <Form onSubmit={authenticate} className='form form-border w-100 form-bg' style={{ maxWidth: '400px' }}>
                <h1 className="my-4 mt-1 text-center text-light">Login</h1>
    
                <Form.Group controlId="userEmail">
                    <Form.Label className='text-light'>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
    
                <Form.Group controlId="password" className='mb-5'>
                    <Form.Label className='text-light'>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
    
                <Button variant={isActive ? "primary" : "danger"} type="submit" disabled={!isActive}>
                    Submit
                </Button>
            </Form>
        </div>
    );
    
}
