import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/** Add many skills to a job, skipping ones that already exist */
export const addJobSkills = async (
    jobId: string,
    skillIds: Array<string | number>
) => {
    return prisma.jobSkill.createMany({
        data: skillIds.map(id => ({ jobId, skillId: String(id) })),
        skipDuplicates: true,
    });
};

export const getSkillsForJob = async (jobId: string) => {
    return prisma.jobSkill.findMany({
        where: { jobId },
        include: { skill: true },
    });
};
