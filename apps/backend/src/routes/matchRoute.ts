import express from 'express';
import { matchResumeToJobs } from '../services/jobMatcher'; // adjust path

const router = express.Router();

router.get('/match', async (req, res) => {
    try {
        const { resumeId, categories, location } = req.query;

        console.log('[API] Received GET /match');
        console.log('[API] Query Params:', { resumeId, categories, location });

        if (typeof resumeId !== 'string' || !resumeId.trim()) {
            console.warn('[API] Invalid resumeId:', resumeId);
            return res.status(400).json({ error: 'Missing or invalid resumeId' });
        }

        if (typeof categories !== 'string' || !categories.trim()) {
            console.warn('[API] Invalid categories:', categories);
            return res.status(400).json({ error: 'Missing or invalid categories' });
        }

        const categoriesArray = categories
            .split(',')
            .map(cat => cat.trim().toLowerCase());

        const locationFilter = typeof location === 'string' ? location.trim() : undefined;

        console.log('[API] Calling matchResumeToJobs with:', {
            resumeId,
            categoriesArray,
            locationFilter,
        });

        const matchedJobs = await matchResumeToJobs(
            resumeId,
            categoriesArray,
            locationFilter
        );

        console.log('[API] matchResumeToJobs returned:', matchedJobs.length, 'matches');

        return res.json({ matchedJobs });
    } catch (error) {
        console.error('[API] Error in /api/match:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
