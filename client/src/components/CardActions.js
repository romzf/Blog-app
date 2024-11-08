// src/components/CardActions.js
import { useNavigate } from 'react-router-dom';
import {Button } from 'react-bootstrap';

export default function CardActions({ movieId}) {
    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate(`/posts/${movieId}`); // Navigates to MovieDetails view
    };

    return (
        <Button 
            variant="primary" 
            className="btn btn-sm" 
            onClick={handleDetailsClick}
        >
            Details
        </Button>
    );
};
