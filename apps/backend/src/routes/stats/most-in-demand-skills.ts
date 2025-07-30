// Top 10 most frequent skills
import { PrismaClient } from '@prisma/client';
import express from 'express';

export const prisma = new PrismaClient();

const router = express.Router();

router.get('/', async (req, res) => {
    const result = await prisma.skill.groupBy({
        by: ['label'],
        _count: true,
        orderBy: {
            _count: { label: 'desc' },
        },
        take: 20,
    });

    res.json(result);
});

export default router;