import express from 'express';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
const applicationRouter = express.Router();

// POST – Create new application
applicationRouter.post('/', async (req, res) => {
    const { resumeId, jobPostingId, appliedDate, status, note } = req.body;

    try {
        const newApp = await prisma.application.create({
            data: {
                resumeId,
                jobPostingId,
                appliedDate: appliedDate ? new Date(appliedDate) : null,
                status: status || 'Applied',
                note: note || '',
            },
        });

        res.status(201).json({ success: true, application: newApp });
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({ success: false, error: 'Failed to add application' });
    }
});

// GET – All applications
applicationRouter.get('/all', async (req, res) => {
    try {
        const apps = await prisma.application.findMany({
            include: {
                jobPosting: {
                    include: {
                        company: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(apps);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// DELETE – Application by ID
applicationRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.application.delete({ where: { id } });
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting application');
    }
});

// PATCH – Update application status
applicationRouter.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await prisma.application.update({
            where: { id },
            data: { status },
        });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating application');
    }
});

export default applicationRouter;


