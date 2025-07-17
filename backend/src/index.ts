import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Import routes
import contentRoutes from './routes/content';
import replRoutes from './routes/repl';

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Interactive Programming Tutorial API' });
});

app.use('/api/content', contentRoutes);
app.use('/api/repl', replRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
