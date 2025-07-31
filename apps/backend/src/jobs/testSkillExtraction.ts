import { PrismaClient } from '@prisma/client';
import { CanonicalSkill, extractSkills } from '../utils/extractSkills';
const prisma = new PrismaClient();

async function loadCanonicalSkillsFromDb(): Promise<CanonicalSkill[]> {
    const skills = await prisma.skill.findMany({
        select: { id: true, label: true },
    });
    return skills.map((s: { id: string; label: string }) => ({ id: s.id, name: s.label }));
}

async function test() {
    // Await the canonical skills here inside async function
    const canonicalSkills = await loadCanonicalSkillsFromDb();

    // Example job description text
    const sampleText = `
    Proficient in Python, PostgreSQL, machine learning, and statistics.
    Experience with data mining and Tableau.
  `;

    // Extract skills using resolved canonicalSkills array
    const matchedSkills = extractSkills(sampleText, canonicalSkills);

    console.log('Matched skills:', matchedSkills);

    // Find one jobPosting to test insert
    const testJobPosting = await prisma.jobPosting.findFirst();

    if (!testJobPosting) {
        console.error('No jobPosting found in DB');
        process.exit(1);
    }

    const skillData = matchedSkills.map(skill => ({
        jobId: testJobPosting.id,
        skillId: skill.canonical_skill_id!,  // Make sure this matches your extractSkills output

    }));

    // Clear old skills for this jobPosting
    await prisma.jobSkill.deleteMany({ where: { jobId: testJobPosting.id } });

    // Insert matched skills
    await prisma.jobSkill.createMany({
        data: skillData,
        skipDuplicates: true,
    });

    console.log(`Inserted ${skillData.length} skills for jobPosting ${testJobPosting.jobId}`);

    await prisma.$disconnect();
}

test();

