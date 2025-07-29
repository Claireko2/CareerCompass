//src/resume/service.ts
import prisma from '../db';
import { ParsedResume } from '../resume/parser';

export async function saveResumeToDb(parsed: ParsedResume) {
    const resume = await prisma.resume.create({
        data: {
            email: parsed.email,
            phone: parsed.phone,
            rawText: parsed.raw_text,
            skills: {
                create: parsed.skills.map(skill => ({
                    skillName: skill.skill_name,
                    canonicalSkillId: skill.canonical_skill_id,
                    source: skill.source,
                })),
            },
        },
        include: {
            skills: true,
        },
    });
    return resume.id;
}
