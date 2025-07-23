// skillCache.ts

import prisma from '../db'; // adjust your prisma client path
import { CanonicalSkill } from './extractSkills';

let cachedSkills: CanonicalSkill[] | null = null;

export async function getCachedSkills(): Promise<CanonicalSkill[]> {
    if (!cachedSkills) {
        const skills = await prisma.skill.findMany({
            select: { id: true, label: true },
        });
        cachedSkills = skills.map(skill => ({
            id: skill.id,
            name: skill.label,
        }));
    }
    return cachedSkills;
}
