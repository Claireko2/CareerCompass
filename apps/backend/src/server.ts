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

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend API! Try POST /extract or GET /health');
});

//Mount JobMacher route 
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

const PORT = process.env.PORT || 10000;

async function startServer() {

    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

startServer();
