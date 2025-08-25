// routes/jobsRouter.ts
import { PrismaClient } from '@prisma/client';
import express from 'express';
import { ingestJobsByCategory } from '../jobs/ingestJobs';
import { z } from 'zod';

export const prisma = new PrismaClient();

const jobsRouter = express.Router();

// POST /load with optional date_posted filter
jobsRouter.post('/load', async (req, res) => {
    try {
        const input = {
            category: (req.body.category ?? req.query.category ?? '').trim() || undefined,
            date_posted: req.body.date_posted ?? req.query.date_posted,
        };

        const schema = z.object({
            category: z.string().min(2).default('software engineer'),
            date_posted: z.enum(['all', 'today', '3days', 'week', 'month']).optional(),
        });

        const { category, date_posted } = schema.parse(input);

        await ingestJobsByCategory(category, date_posted || 'all');

        res.status(200).json({
            success: true,
            message: `Ingested jobs for ${category} with date_posted: ${date_posted || 'all'}`,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ success: false, errors: (err as any).errors || err });
    }
});

// GET /?category=&location=&date_posted=
jobsRouter.get('/', async (req, res) => {
    try {
        const category = req.query.category?.toString() || '';
        const location = req.query.location?.toString() || '';
        const datePosted = (req.query.date_posted?.toString() || 'all') as
            | 'all'
            | 'today'
            | '3days'
            | 'week'
            | 'month';

        // Build where clause
        const whereClause: any = {
            title: { contains: category, mode: 'insensitive' },
        };

        if (location) {
            whereClause.location = {
                OR: [
                    { city: { contains: location, mode: 'insensitive' } },
                    { region: { contains: location, mode: 'insensitive' } },
                    { country: { contains: location, mode: 'insensitive' } },
                ],
            };
        }

        // Handle date filter based on updatedAt
        let dateThreshold: Date | undefined;
        switch (datePosted) {
            case 'today':
                dateThreshold = new Date();
                dateThreshold.setHours(0, 0, 0, 0);
                break;
            case '3days':
                dateThreshold = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
                break;
            case 'week':
                dateThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                dateThreshold = new Date();
                dateThreshold.setMonth(dateThreshold.getMonth() - 1);
                break;
            case 'all':
            default:
                dateThreshold = undefined;
        }

        if (dateThreshold) {
            whereClause.updatedAt = { gte: dateThreshold };
        }

        const jobs = await prisma.jobPosting.findMany({
            where: whereClause,
            take: 20,
            include: {
                company: true,
                location: true,
            },
            orderBy: { updatedAt: 'desc' },
        });

        res.json({ jobs });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

export default jobsRouter;
