// routes/jobsRouter.ts
import { PrismaClient } from '@prisma/client';
import express from 'express';
import { ingestJobsByCategory } from '../jobs/ingestJobs';
import { z } from 'zod';

export const prisma = new PrismaClient();

const jobsRouter = express.Router();

jobsRouter.post('/load', async (req, res) => {
    try {
        const schema = z.object({ category: z.string().min(2) });
        const { category } = schema.parse(req.body);

        await ingestJobsByCategory(category);
        res.status(200).json({ success: true, message: `Ingested jobs for ${category}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to ingest jobs' });
    }
});

jobsRouter.get('/', async (req, res) => {
    try {
        const category = req.query.category?.toString() || '';
        const location = req.query.location?.toString() || '';

        // 組裝 where 條件
        const whereClause: any = {
            title: {
                contains: category,
                mode: 'insensitive',
            },
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

        const jobs = await prisma.jobPosting.findMany({
            where: whereClause,
            take: 20,
            include: {
                company: true,
                location: true,
            },
            orderBy: {
                postedAt: 'desc',
            },
        });

        res.json({ jobs });
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

export default jobsRouter;

