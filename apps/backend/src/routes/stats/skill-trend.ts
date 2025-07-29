import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const rawResult = await prisma.$queryRaw<
      { week: Date; skill: string; frequency: bigint }[]
    >`
      SELECT
        DATE_TRUNC('week', jp."updatedAt") AS week,
        s.label AS skill,
        COUNT(*) AS frequency
      FROM core."JobPosting" jp
      JOIN core."JobSkill" jps ON jp.id = jps."jobId"
      JOIN core."esco_skills" s ON jps."skillId" = s.id::uuid
      GROUP BY week, s.label
      ORDER BY week DESC
      LIMIT 50;

    `;
    const result = rawResult.map(item => ({
      week: item.week,
      skill: item.skill,
      frequency: Number(item.frequency)  // 這裡轉型
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching skill trends:', error);
    res.status(500).json({ error: 'Failed to fetch skill trends' });
  }
});

export default router;
