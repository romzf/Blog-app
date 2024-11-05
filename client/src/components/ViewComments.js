// src/components/ViewComments.js
import React from 'react';
import { Card, Modal, Button } from 'react-bootstrap';

const ViewComments = ({ comments, show, handleClose, deleteComment, postId }) => {
    
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {comments.length > 0 ? (
                    comments.slice().reverse().map((comment) => (
                        <Card key={comment._id} className="mt-2 custom-detail-card">
                            <Card.Body>
                                <div className='d-flex justify-content-between'>
                                    <Card.Subtitle className='fw-semibold'>
                                        {comment.username}
                                    </Card.Subtitle>
                                    <Card.Text>{new Date(comment.creationDate).toLocaleString()}</Card.Text>
                                </div>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Card.Text>{comment.comment}</Card.Text>
                                    <Button
                                        variant="danger"
                                        className="btn-sm"
                                        onClick={() => deleteComment(postId, comment._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>No comments available.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewComments;
