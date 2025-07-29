import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

type SkillCountByLocation = {
    locationId: string;
    locationName: string;
    skillName: string;
    skillCount: number;
};

type GroupedSkill = {
    location: string;
    skills: { skill: string; count: number }[];
};

router.get('/', async (req: Request, res: Response) => {
    try {
        const results = await prisma.$queryRaw<SkillCountByLocation[]>`
      SELECT
        jp."locationId",
        l."city" AS locationName,
        es."label" AS "skillName",
        COUNT(*) AS skillCount
      FROM core."JobPosting" jp
      JOIN core."JobSkill" js ON js."jobId" = jp.id
      JOIN core."esco_skills" es ON js."skillId" = es.id
      JOIN core."Location" l ON l.id = jp."locationId"
      GROUP BY jp."locationId", l."city", es."label"
      ORDER BY jp."locationId", skillCount DESC;
    `;

        const grouped: GroupedSkill[] = results.reduce((acc, row) => {
            let loc = acc.find(item => item.location === row.locationName);
            if (!loc) {
                loc = { location: row.locationName, skills: [] };
                acc.push(loc);
            }
            loc.skills.push({ skill: row.skillName, count: Number(row.skillCount) });
            return acc;
        }, [] as GroupedSkill[]);

        res.status(200).json(grouped);
    } catch (error) {
        console.error('Error fetching skills by location:', error);
        res.status(500).json({ error: 'Failed to fetch skill counts by location' });
    }
});

export default router;
