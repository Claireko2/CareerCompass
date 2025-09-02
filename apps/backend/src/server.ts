import 'cross-fetch/polyfill'; // Polyfill fetch globally in Node.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Routes
import resumeRouter from './routes/resumeUpload';
import matchRouter from './routes/matchRoute';
import jobsRouter from './routes/jobsRouter';
import applicationRouter from './routes/applicationRoute';
import mostInDemandSkills from './routes/stats/most-in-demand-skills';
import regionalSkills from './routes/stats/regional-skills';
import skillTrend from './routes/stats/skill-trend';

// Jobs ingestion
import { ingestJobs } from './jobs/ingestJobs';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

// Middleware
app.use(cors({
  origin: "https://career-compass-frontend-hazel.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Base route
app.get('/', (_req, res) => {
  res.send('Welcome to the Career Compass backend API!');
});

// Simple health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Debug/test route
app.get('/api/test', (_req, res) => {
  res.json({ msg: 'API is live!' });
});

// Mount routes
app.use('/api', matchRouter); // /api/match
app.use('/api/application', applicationRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/stats/most-in-demand-skills', mostInDemandSkills);
app.use('/api/stats/regional-skills', regionalSkills);
app.use('/api/stats/skill-trend', skillTrend);

// Job ingestion endpoint
app.post('/api/jobs/ingest', async (_req, res) => {
  try {
    await ingestJobs();
    res.json({ status: 'success', message: 'Job ingestion completed.' });
  } catch (err) {
    console.error('Ingestion error:', err);
    res.status(500).json({ status: 'error', message: 'Job ingestion failed.' });
  }
});

// Global error handling for uncaught exceptions/rejections
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason, promise) =>
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
);

// Start server after DB connection
async function startServer() {
  try {
    await prisma.$connect();
    console.log('DB connected successfully');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on 0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
}

startServer();
