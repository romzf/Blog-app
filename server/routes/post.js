const express = require('express');
const postController = require('../controllers/post');
const auth = require("../auth");
const {verify} = auth;

const router = express.Router();

router.post("/addPost", verify, postController.addPost);
router.get("/getAllPosts", postController.getAllPosts);
router.get("/myposts", verify, postController.getUserPosts);
router.post("/comment/:id", verify, postController.addComment);
router.put("/editPost/:id", verify, postController.editPost);
router.delete("/comment/:postId/:commentId", verify, postController.deleteComment);
router.get("/:id", postController.getPostById);
router.delete("/:id", verify, postController.deletePost);

module.exports = router;
