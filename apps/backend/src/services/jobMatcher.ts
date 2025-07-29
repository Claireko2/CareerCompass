import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Normalize skills
function normalizeSkill(skill: string): string {
    return skill.toLowerCase().replace(/\s*\(.*?\)/g, '').trim();
}

/**
 * @param resumeId - resume ID
 * @param categories - job title
 * @param locationFilter - Location - city、region、country 
 */
export async function matchResumeToJobs(
    resumeId: string,
    categories: string[],
    locationFilter?: string
) {
    // 1. retrive skills
    const resumeSkills = await prisma.resumeSkill.findMany({
        where: { resumeId },
        select: { skillName: true },
    });

    const resumeSkillSet = new Set(
        resumeSkills.map(s => normalizeSkill(s.skillName))
    );
    console.log("Normalized Resume Skills:", Array.from(resumeSkillSet));

    // 2. add the location
    const whereCondition: any = {
        AND: [
            {
                OR: categories.map(cat => ({
                    title: {
                        contains: cat,
                        mode: 'insensitive',
                    }
                })),
            },
        ],
    };

    if (locationFilter) {
        whereCondition.AND.push({
            OR: [
                { location: { city: { contains: locationFilter, mode: 'insensitive' } } },
                { location: { region: { contains: locationFilter, mode: 'insensitive' } } },
                { location: { country: { contains: locationFilter, mode: 'insensitive' } } },
            ],
        });
    }

    // 3. job matcher
    const jobPostings = await prisma.jobPosting.findMany({
        where: whereCondition,
        include: {
            skills: {
                include: { skill: true },
            },
            company: true,
            location: true,
        },
    });

    console.log('[Matcher] Found', jobPostings.length, 'job postings');

    // 4. get the user application
    const userApplications = await prisma.application.findMany({
        where: { resumeId },
        select: { jobPostingId: true, status: true },
    });

    const appliedJobMap = new Map(
        userApplications.map(app => [app.jobPostingId, app.status])
    );

    // 5. match score
    const jobMatches = jobPostings.map(job => {
        const requiredSkills = job.skills.map(js => normalizeSkill(js.skill.label));
        const totalSkills = requiredSkills.length;

        const matchedSkills = requiredSkills.filter(s => resumeSkillSet.has(s));
        const missingSkills = requiredSkills.filter(s => !resumeSkillSet.has(s));

        const matchScore = totalSkills > 0 ? matchedSkills.length / totalSkills : 0;

        const locationString = job.location
            ? [job.location.city, job.location.region, job.location.country]
                .filter(Boolean)
                .join(', ')
            : 'Unknown';

        return {
            jobId: job.id,
            title: job.title,
            description: job.description,
            qualifications: job.qualifications,
            responsibilities: job.responsibilities,
            company: job.company?.name || 'Unknown Company',
            location: locationString,
            matchScore,
            matchedSkills,
            missingSkills,
            status: appliedJobMap.get(job.id) || 'Not Applied',
            url: job.url,
        };
    });

    // 6. return match score
    return jobMatches.sort((a, b) => b.matchScore - a.matchScore);
}
