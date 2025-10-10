# Blogging Website - Backend

## Description
This is the **backend server** for a blogging platform where users can register, login, create, update, and delete blog posts, comment on posts, and manage their profiles. The server exposes **RESTful APIs** to interact with the frontend.

---

## Features
- User authentication (Sign up, Login, Logout)
- CRUD operations for blog posts
- Commenting system for blogs
- Search functionality for blogs
- Notifications for user interactions
- Profile management (edit profile, change password)
- Secure password hashing & JWT-based authentication
- Cloud storage support for images (AWS / Firebase)

---

## Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT, bcrypt  
- **Other Libraries:** Axios, dotenv, cors, mongoose  
- **Cloud Storage:** Cloudinary (for images)

---

## Installation

1. Clone the repository:

git clone https://github.com/Prachi-1716/blog-server.git
cd blog-server

2. Install dependencies:

npm install

3. Create a .env file with your environment variables (example):

PORT=3000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

4.Start the server:

npm start
# or for development with auto-reload
npm run dev

Server will run at http://localhost:3000.


# Blog Server API

Base URL: `/api`

---

## Auth Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/auth/me`      | Get logged-in user info |
| POST   | `/api/auth/register`| Register a new user |
| POST   | `/api/auth/login`   | Login a user |
| POST   | `/api/auth/logout`  | Logout the current user |
| POST   | `/api/auth/google`  | Login/Register with Google |

---

## Blog Routes (`/api/blogs`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/blogs`        | Fetch all blogs |
| POST   | `/api/blogs`        | Create a new blog (requires authentication, banner image optional) |
| POST   | `/api/blogs/image`  | Upload an image (requires authentication) |
| GET    | `/api/blogs/:id`    | Fetch single blog by ID |
| PATCH  | `/api/blogs/:id`    | Update blog by ID (requires authentication, banner image optional) |
| DELETE | `/api/blogs/:id`    | Delete blog by ID (requires authentication) |

### Comments on a Blog

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/blogs/:id/comments`           | Add a comment to a blog (requires authentication) |
| GET    | `/api/blogs/:id/comments`           | Fetch all comments for a blog |
| GET    | `/api/blogs/:blogId/comments/:commentId` | Fetch a single comment |
| DELETE | `/api/blogs/:id/comments/:commentId` | Delete a comment (requires authentication) |

### Likes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/blogs/:id/likes`  | Get like state for a blog |
| PATCH  | `/api/blogs/:id/likes` | Like/unlike a blog (requires authentication) |

---

## Search Routes (`/api/search`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/search/blogs?query=` | Search blogs |
| GET    | `/api/search/users?query=` | Search users |

---

## User Routes (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH  | `/api/users/me`                     | Update user profile (requires authentication, profile picture optional) |
| PATCH  | `/api/users/me/password`            | Change password (requires authentication) |
| GET    | `/api/users/me/notifications`      | Fetch notifications (requires authentication) |
| PATCH  | `/api/users/me/notifications/read` | Mark notifications as read (requires authentication) |
| DELETE | `/api/users/me/notifications/:id`  | Delete a notification (requires authentication) |
| GET    | `/api/users/:id`                    | Get user info by ID (or search a user) |
