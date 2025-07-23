import 'cross-fetch/polyfill'; // Polyfill fetch globally in Node.js
import dotenv from 'dotenv';
import express from 'express';
import resumeRouter from './routes/resumeUpload';
import { ingestJobs } from './jobs/ingestJobs';
import pLimit from 'p-limit';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend API! Try POST /extract or GET /health');
});

// Mount resume routes under /api/resume
app.use('/api/resume', resumeRouter);

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

// Example fetchJobs function you can import and call when needed
export async function fetchJobs() {
    const response = await fetch(
        'https://jsearch.p.rapidapi.com/search?query=software+engineer',
        {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Fetch failed');
    }

    return data;
}

const PORT = process.env.PORT || 8000;

async function startServer() {

    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

startServer();
