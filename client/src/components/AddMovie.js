// src/components/AddPost.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function AddPost({ show, handleClose, fetchData, postsData }) {
    const notyf = new Notyf();
    const [title, setTitle] = useState('');
    const [picture, setPicture] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleAddPost = (e) => {
        e.preventDefault();

        // Check for duplicate title
        const duplicate = postsData?.some(post => post.title === title);
        if (duplicate) {
            setError('Post title already exists. Please choose a different title.');
            return;
        } else {
            setError('');
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/addPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                picture,
                title,
                content
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                console.log('Post added:', data);
                fetchData(); // Refresh the post list
                handleClose();
                notyf.success('Post added successfully');
            }
        })
        .catch(err => {
            console.error('Error adding post:', err);
            notyf.error('Error adding post. Please try again.');
        });
    };

    return (
        <Modal show={show} onHide={handleClose} dialogClassName="modal-dialog-centered">
            <Modal.Header closeButton className='custom-modal'>
                <Modal.Title className='mx-auto me-2'>Add Post</Modal.Title>
            </Modal.Header>
            <Modal.Body className='custom-modal'>
                <Form onSubmit={handleAddPost}>
                    <Form.Group controlId="postPicture">
                        <Form.Label>Picture URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter image URL"
                            value={picture}
                            onChange={(e) => setPicture(e.target.value)}
                            required
                            className="bg-secondary text-white"
                        />
                    </Form.Group>
                    <Form.Group controlId="postTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="bg-secondary text-white"
                        />
                    </Form.Group>
                    <Form.Group controlId="postContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter post content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className="bg-secondary text-white"
                        />
                    </Form.Group>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Button variant="primary" type="submit" className="mt-3 me-2">
                        Add Post
                    </Button>
                    <Button variant="secondary" className="mt-3" onClick={handleClose}>
                        Close
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
