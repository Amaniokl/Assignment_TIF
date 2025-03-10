import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDb } from './db.js';

// Import routes
import authRoutes from './routes/auth.js';
import memberRoutes from './routes/member.js';
import communityRoutes from './routes/community.js';
import roleRoutes from './routes/roles.js';
import cors from "cors"
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Parse JSON before routes
app.use(cookieParser()); // Parse cookies before routes
app.use(express.urlencoded({ extended: true })); // Handle URL-encoded data
app.use(cors({ origin: '*', credentials: true })); // Allow CORS


// Set up routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/members', memberRoutes);
app.use('/api/v1/communities', communityRoutes);
app.use('/api/v1/roles', roleRoutes);

const server = http.createServer(app);

// Connect to MongoDB and start server
connectDb()
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

export default app;
