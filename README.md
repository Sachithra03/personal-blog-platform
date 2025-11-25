# Personal Blog Platform

A full-stack blog platform built with the MERN stack, featuring user authentication, rich text editing, image uploads, likes, and comments.

## 🚀 Live Demo

**Frontend:** [https://personal-blog-platform-master.vercel.app/](https://personal-blog-platform-master.vercel.app/)

**Backend API:** [https://personal-blog-platform-master.onrender.com](https://personal-blog-platform-master.onrender.com)

## ✨ Features

### User Features
- **Authentication & Authorization**
  - User registration and login with JWT tokens
  - Secure password hashing with bcrypt
  - Protected routes for authenticated users

- **User Profiles**
  - Customizable profile pictures (avatar upload)
  - Editable usernames
  - View user posts and activity
  - Personal profile page

- **Blog Posts**
  - Create posts with rich text editor (ReactQuill)
  - Upload cover images (up to 5MB)
  - Edit and delete your own posts
  - View all posts on the home feed

- **Social Features**
  - Like/unlike posts
  - Comment on posts
  - Real-time like and comment counts
  - View post details with full comments

### Technical Features
- Responsive design with Tailwind CSS
- Image storage in MongoDB (Base64 encoding)
- RESTful API architecture
- Token-based authentication
- File upload with Multer
- Cross-Origin Resource Sharing (CORS) enabled

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **ReactQuill** - Rich text editor
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

## 📁 Project Structure

```
personal-blog-platform/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PostCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── UpdatePost.jsx
    │   │   ├── PostDetail.jsx
    │   │   └── Profile.jsx
    │   ├── utils/
    │   │   ├── imageUrl.js
    │   │   └── previewImage.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sachithra03/personal-blog-platform.git
cd personal-blog-platform
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
# Add the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Start the backend server
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file
# Add the following variable:
REACT_APP_API_URL=http://localhost:5000/api

# Start the frontend
npm start
```

The application will open at `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile/:username` - Get user profile
- `PATCH /api/auth/profile` - Update profile (protected)
- `DELETE /api/auth/profile/avatar` - Delete avatar (protected)
- `GET /api/auth/avatar/:userId` - Get user avatar image

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `GET /api/posts/:id/image` - Get post cover image
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `PATCH /api/posts/:id/like` - Toggle like (protected)
- `POST /api/posts/:id/comment` - Add comment (protected)

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env)
```env
# For local development
REACT_APP_API_URL=http://localhost:5000/api

# For production
REACT_APP_API_URL=https://your-backend-app.onrender.com/api
```

## 🚀 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables (MONGO_URI, JWT_SECRET, PORT)

### Frontend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory
3. Run: `vercel`
4. Set environment variable: `REACT_APP_API_URL`

## 📸 Screenshots

### Home Page
- Displays all blog posts in a feed
- Like and comment on posts
- Responsive grid layout

### Create Post
- Rich text editor for content
- Upload cover images
- Real-time preview

### Profile Page
- View user information
- Edit profile details
- See all user posts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Sachithra Indrachapa**
- GitHub: [@Sachithra03](https://github.com/Sachithra03)

## 🙏 Acknowledgments

- React documentation
- MongoDB documentation
- Tailwind CSS
- ReactQuill library
- Express.js community

---

⭐ Star this repository if you find it helpful!
