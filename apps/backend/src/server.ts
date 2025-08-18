import 'cross-fetch/polyfill'; // Polyfill fetch globally in Node.js
import dotenv from 'dotenv';
import express from 'express';
import resumeRouter from './routes/resumeUpload';
import { ingestJobs } from './jobs/ingestJobs';
import matchRouter from './routes/matchRoute';
import cors from 'cors';
import jobsRouter from './routes/jobsRouter';
import applicationRouter from './routes/applicationRoute';
import mostInDemandSkills from './routes/stats/most-in-demand-skills';
import regionalSkills from './routes/stats/regional-skills';
import skillTrend from './routes/stats/skill-trend';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend API! Try POST /extract or GET /health');
});

//Mount JobMatcher route
app.use('/api', matchRouter);

//Application route
app.use('/api/application', applicationRouter);

// Mount resume routes under /api/resume
app.use('/api/resume', resumeRouter);

//UI Job ingest
app.use('/api/jobs', jobsRouter);

// Mount skill analysis/statistics routes
app.use('/api/stats/most-in-demand-skills', mostInDemandSkills);
app.use('/api/stats/regional-skills', regionalSkills);
app.use('/api/stats/skill-trend', skillTrend);

// Simple health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/jobs/ingest', async (req, res) => {
    try {
        await ingestJobs();
        res.json({ status: 'success', message: 'Job ingestion completed.' });
    } catch (err) {
        console.error('Ingestion error:', err);
        res.status(500).json({ status: 'error', message: 'Job ingestion failed.' });
    }
});

// Listen on environment port or fallback 10000, bind to 0.0.0.0 to allow external access
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function startServer() {
    try {
        await prisma.$connect();
        console.log('DB connected');
        app.listen(PORT, '127.0.0.1', () => {
            console.log(`Server listening on 127.0.0.1:${PORT}`);
        });
    } catch (err) {
        console.error('DB connection error:', err);
        process.exit(1);
    }
}

startServer();
