import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Loading from '../components/Loading';
import AddMovie from '../components/AddMovie';
import '../App.css';

export default function Movies() {
    const [loading, setLoading] = useState(true);
    const [moviesData, setMoviesData] = useState([]);
    const [showAddMovie, setShowAddMovie] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchData = useCallback(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/getAllPosts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setMoviesData(data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching movies:', err);
                setLoading(false);
            });
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!token) {
        return <Navigate to="/login" />;
    }

    const handleShowAdd = () => setShowAddMovie(true);
    const handleCloseAdd = () => setShowAddMovie(false);

    const handleDetailsClick = (movieId) => {
        navigate(`/posts/${movieId}`);
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="d-flex justify-content-center pt-3">
                        <h1 className="text-light">Posts</h1>
                    </div>
                    <div className="d-flex justify-content-center mb-3">
                        <Button id="AddMovie" variant="success" onClick={handleShowAdd}>
                            Add Post
                        </Button>
                    </div>
                    {moviesData.length > 0 ? (
                        <Row className="mx-5">
                            {moviesData.slice().reverse().map((movie, index) => (
                                <Col key={movie._id} xxl={12} className="mb-4 d-flex justify-content-center">
                                    <Card
                                        className="mt-3 d-flex flex-column custom-card"
                                        style={{ minHeight: '400px', flex: '1 0 50%', maxWidth: '1000px', marginInline: '10%' }}
                                        onClick={() => handleDetailsClick(movie._id)}
                                    >
                                        <Card.Body className="flex-grow-1 d-flex flex-column">
                                            <div className='d-flex justify-content-between'>
                                                <Card.Title>{movie.title}</Card.Title>
                                                <Card.Text className='text-success'>{new Date(movie.creationDate).toLocaleString()}</Card.Text>
                                            </div>
                                            
                                            <Card.Img variant="top" src={movie.picture} alt="Card image" onClick={() => handleDetailsClick(movie._id)} />
                                            <br />
                                            <Card.Text>{movie.content}</Card.Text>
                                            <Card.Subtitle>{movie.author.username}</Card.Subtitle>
                                        </Card.Body>
                                        <Card.Footer className="d-flex justify-content-between custom-footer">
                                            <Card.Subtitle className="my-1">Comments: {movie.comments.length}</Card.Subtitle>
                                            <Card.Subtitle className="my-1">Post Index: {moviesData.length - index}</Card.Subtitle>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="d-flex flex-column align-items-center">
                            <img src="/EmptyWorkout.png" alt="EmptyWorkout..." className="EmptyWorkout img-fluid" />
                            <h3 className="d-flex justify-content-center mt-2 text-light">
                                Blog list is Empty.
                            </h3>
                        </div>
                    )}
                    <AddMovie show={showAddMovie} handleClose={handleCloseAdd} fetchData={fetchData} moviesData={moviesData} />
                </>
            )}
        </>
    );
}
