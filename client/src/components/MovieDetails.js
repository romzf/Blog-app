// src/components/MovieDetails.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import Loading from '../components/Loading';
import AddComment from './AddComment';

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [comments, setComments] = useState([]);
    
    // Get the token from local storage
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch the movie by ID
        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token here
            }
        })
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                setComments(data.comments);
            })
            .catch(err => console.error('Error fetching movie:', err));

    }, [id, token]); // Add token as a dependency to useEffect

    const handleAddComment = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
    };

    // Function to format userId for display
    const formatUserId = (userId) => {
        if (userId && userId.length > 15) {
            return `${userId.slice(0, 10)}...`; // Show first 10 characters and ellipsis
        }
        return userId;
    };

    const navigate = useNavigate();

    const back = () => {
        navigate(`/blogs/`);
    };

    return (
        <div className="movie-details mx-auto" style={{ maxWidth: '900px' }}>
            {movie ? (
                <div className='pt-4'>
                    <Card className='custom-detail-card' style={{ minHeight: '200px' }}>
                        <Card.Body>
                            <div className='d-flex justify-content-between'>
                                <Card.Title>{movie.title}</Card.Title>
                                <Button variant="btn" className="btn-sm" 
                                    onClick={back}
                                    >
                                    Back
                                </Button>
                            </div>

                            <Card.Img variant="top" src={movie.picture} alt="Card image" />
                            <Card.Text></Card.Text>
                            
                            <Card.Text>{movie.content}</Card.Text>
                            <Card.Text></Card.Text>
                            <Card.Text></Card.Text>
                            
                            <Card.Subtitle>Author:</Card.Subtitle>

                            <div className='d-flex justify-content-between'>
                            <Card.Text>{movie.author.username} ({movie.author.email})</Card.Text>
                            <Card.Text>{new Date(movie.creationDate).toLocaleString()}</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <h5 className='text-light mt-3 fw-bold'>Comments</h5>
                    <AddComment id="addComment" movieId={id} onAddComment={handleAddComment} />
                    <div className="mt-3 pb-3">
                        {comments.length > 0 ? (
                            comments.slice().reverse().map((comment, index) => (
                                <Card key={index} className="mt-2 custom-detail-card">
                                    <Card.Body>
                                        <div className='d-flex justify-content-between'>
                                            <Card.Subtitle className='fw-semibold'>
                                                {formatUserId(comment.username)}
                                            </Card.Subtitle>
                                            <Card.Text>{new Date(comment.creationDate).toLocaleString()}</Card.Text>
                                        </div>
                                        
                                        <Card.Text>{comment.comment}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p className='text-light'>No comments yet.</p>
                        )}
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}
