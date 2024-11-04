User Credentials:
- Admin User
  - email: Admin@mail.com
  - password: sample123
- Dummy Customer
  - email: JohnDoe@mail.com
  - password: sample123



Login
(POST) /users/login
{
    "email": "",
    "password": ""
}

Register
(POST) /users/register
{
    "email": "",
    "username": "",
    "password": ""
}

Add Post
(POST) /posts/addPost
{
  "picture": "image URL",
  "title": "",
  "content": ""
}

Add Comment
(POST) /posts/comment/:id
{
    "comment": ""
}

Get User Posts
(GET) /posts/myposts

Edit User Post
(PUT) /posts/editPost/:id
{
  "picture": "image URL",
  "title": "",
  "content": " "
}

Delete Post
(DELETE) /posts/:id

Delete Comment in Post
(DELETE) /posts/comment/:postId/:commentId