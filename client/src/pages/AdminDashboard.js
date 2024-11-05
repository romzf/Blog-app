// pages/AdminDashboard.js
import { useEffect, useState, useCallback } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
import ViewComments from '../components/ViewComments';
import EditPost from '../components/EditPost';
import { Notyf } from 'notyf';
import '../App.css';

export default function AdminDashboard() {

    const notyf = new Notyf();
    const [loading, setLoading] = useState(true);
    const [moviesData, setMoviesData] = useState([]);
    const [isAdmin, setIsAdmin] = useState(null);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedComments, setSelectedComments] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const token = localStorage.getItem('token');

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

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const commentsData = await response.json();
            setSelectedComments(commentsData.comments); 
            setShowCommentsModal(true);
            setSelectedPost(postId);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const deleteComment = async (postId, commentId) => {

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/comment/${postId}/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            
            if (response.ok) {
                notyf.success('Comment deleted successfully.');
                fetchComments(postId);
            } else {
                const errorData = await response.json();
                notyf.error('Error deleting comment: ' + errorData.message);
                console.error('Error deleting comment:', errorData.message);
            }
        } catch (error) {
            notyf.error('Error deleting comment');
            console.error('Error deleting comment:', error);
        }
    };
    
    const openEditModal = (post) => {
        setSelectedPost(post); 
        setShowEditModal(true); 
    };

    const deletePost = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    fetchData();
                    notyf.success('Post deleted successfully.');
                } else {
                    const errorData = await response.json();
                    notyf.error('Error deleting post');
                    console.error('Error deleting post:', errorData.message);
                }
            } catch (error) {
                notyf.error('Error deleting post');
                console.error('Error deleting post:', error);
            }
        }
    };

    useEffect(() => {
        fetchUserDetails();
        fetchData();
    }, [fetchData, fetchUserDetails]);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (isAdmin === false) { 
        return <Navigate to="/movies" />;
    }

    const getSortedMovies = () => {
        if (!sortConfig.key) return moviesData.slice().reverse();
    
        return [...moviesData].sort((a, b) => {
            const aValue = sortConfig.key === 'username' || sortConfig.key === 'email' ? a.author[sortConfig.key] : a[sortConfig.key];
            const bValue = sortConfig.key === 'username' || sortConfig.key === 'email' ? b.author[sortConfig.key] : b[sortConfig.key];
    
            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const resetSort = () => {
        setSortConfig({ key: '', direction: '' });
    };

    const sortedMovies = getSortedMovies();

    const currentUsername = localStorage.getItem('username');
    

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="d-flex justify-content-center pt-3">
                        <h1 className="text-light">Admin Dashboard</h1>
                    </div>
                    {moviesData.length > 0 ? (
                        <div className="table-responsive mx-5">
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th onClick={() => requestSort('title')} className="sortable" style={{ cursor: 'pointer' }}>Title</th>
                                        <th onClick={() => requestSort('username')} className="sortable" style={{ cursor: 'pointer' }}>Username</th>
                                        <th onClick={() => requestSort('email')} className="sortable" style={{ cursor: 'pointer' }}>Email</th>
                                        <th onClick={() => requestSort('comments')} className="sortable" style={{ cursor: 'pointer' }}>Comments</th>
                                        <th onClick={() => requestSort('creationDate')} className="sortable" style={{ cursor: 'pointer' }}>Creation Date</th>
                                        <th className="sortable" 
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
                                            <div
                                                style={{  flexGrow: 1, padding: '10px', height: '100%', display: 'flex', alignItems: 'center' }}>
                                                Actions
                                            </div>
                                            <Button variant="btn" className="btn-sm reset-button" 
                                                onClick={(e) => { e.stopPropagation(); resetSort(); }}
                                                style={{ marginRight: '10px', padding: '8px' }}>
                                                Reset
                                            </Button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedMovies.map(movie => (
                                        <tr key={movie._id}>
                                            <td>{movie.title}</td>
                                            <td>{movie.author.username}</td>
                                            <td>{movie.author.email}</td>
                                            <td className='d-flex justify-content-between'>
                                                {movie.comments.length}
                                                <Button variant="primary" className='btn btn-sm me-2' onClick={() => fetchComments(movie._id)}>View</Button>
                                            </td>
                                            <td>{new Date(movie.creationDate).toLocaleString()}</td>
                                            <td className='d-flex justify-content-around'>
                                            <Button 
                                                onClick={() => openEditModal(movie)} 
                                                className='btn btn-sm' 
                                                variant="primary" 
                                                disabled={currentUsername !== movie.author.username}
                                            >
                                                Edit
                                            </Button>
                                                <Button variant="danger" className='btn btn-sm' onClick={() => deletePost(movie._id)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="d-flex flex-column align-items-center">
                            <img src="/EmptyWorkout.png" alt="EmptyWorkout..." className="EmptyWorkout img-fluid" />
                            <h3 className="d-flex justify-content-center mt-2 text-light">
                                No posts available.
                            </h3>
                        </div>
                    )}
                    <ViewComments 
                        comments={selectedComments} 
                        show={showCommentsModal} 
                        handleClose={() => setShowCommentsModal(false)} 
                        deleteComment={deleteComment}
                        postId={selectedPost}
                    />
                    <EditPost 
                        show={showEditModal} 
                        handleClose={() => setShowEditModal(false)} 
                        post={selectedPost} 
                        refreshData={fetchData} 
                    />
                </>
            )}
        </>
    );
}
