import express from 'express';
import cors from 'cors';
import jobsRouter from './routes/jobsRouter';
import applicationRouter from './routes/applicationRoute';
import resumeUploadRouter from './routes/resumeUpload';
import resumeMatchRouter from './routes/matchRoute';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (adjust if needed)
app.use(cors());

// Built-in middleware to parse JSON bodies
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount routers
app.use('/api/jobs', jobsRouter);
app.use('/api/application', applicationRouter);
app.use('/api/resume/upload', resumeUploadRouter);
app.use('/api/resume/match', resumeMatchRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
