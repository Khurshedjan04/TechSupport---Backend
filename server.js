const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const supportRequestRoutes = require('./routes/supportRequestRoutes');
const quoteRequestRoutes = require('./routes/quoteRequestRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = `mongodb+srv://Xurshed:${process.env.DB_PASSWORD}@cluster0.pxwfpcg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/supportRequests', supportRequestRoutes);
app.use('/api/quoteRequests', quoteRequestRoutes);
app.use('/api/requests', supportRequestRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Dern-Support API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});