const Post = require('../models/Post');
const User = require('../models/User'); // Assuming you'll need user data for some functionalities

module.exports.addPost = async (req, res) => {
    const { picture, title, content } = req.body;
    const userId = req.user.id; // Get userId from the decoded token

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    const newPost = new Post({
        userId,
        picture,
        title,
        content,
        author: { username: user.username, email: user.email },
    });

    await newPost.save()
        .then((result) => res.status(201).send(result))
        .catch(error => res.status(400).send(error));
};

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate("author", "username email");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        if (posts.length === 0) {
            return res.status(404).send({ message: 'No posts available.' });
        }

        res.send(posts);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};


module.exports.getUserPosts = async (req, res) => {
    try {
        // Use the userId from the decoded token
        const userId = req.user.id;
        const posts = await Post.find({ userId });

        if (posts.length === 0) {
            return res.status(404).send({ message: 'No posts found for this user.' });
        }

        res.send(posts);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};

module.exports.addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const postId = req.params.id;
        const userId = req.user.id;
        const username = req.user.username;

        console.log(username)
        if (!comment || comment.trim() === '') {
            return res.status(400).send({ message: 'Comment is required.' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ message: 'Post not found.' });
        }
        console.log({ userId, username, comment });

        post.comments.push({ userId, username, comment });
        await post.save();

        res.status(201).send({ message: 'Comment added successfully.', post });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};

module.exports.editPost = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    res.send(post);
};

module.exports.deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const commentIndex = post.comments.findIndex(c => c._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        const comment = post.comments[commentIndex];

        if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).send({ message: 'You do not have permission to delete this comment' });
        }

        // Remove the comment
        post.comments.splice(commentIndex, 1);
        await post.save();

        res.send({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};


module.exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const userId = req.user.id; // Get userId from the decoded token

        // Check if the user is the owner of the post or an admin
        if (post.userId.toString() !== userId && !req.user.isAdmin) {
            return res.status(403).send({ message: 'You do not have permission to delete this post' });
        }

        // Delete the post
        await Post.findByIdAndDelete(id);
        res.send({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};

