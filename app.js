require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ApiError = require('./errors/ApiError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Centralized Error Handling',
    endpoints: {
      posts: '/api/posts',
      comments: '/api/comments'
    }
  });
});

app.use((req, res, next) => {
  next(ApiError.notFound('Route not found'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));