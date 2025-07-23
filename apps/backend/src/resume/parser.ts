//src/resume/parser.ts
import { extractTextFromPdf, extractTextFromDocx, extractTextFromTxt } from './fileUtils';
import { extractSkills, SkillMatch } from '../utils/extractSkills';
import { getCachedSkills } from '../utils/skillCache';

export interface ParsedResume {
    name?: string;
    email?: string;
    phone?: string;
    raw_text: string;
    skills: SkillMatch[];
}

export async function parseResume(buffer: Buffer, mimeType: string): Promise<ParsedResume> {
    let text = '';

    if (mimeType === 'application/pdf') {
        text = await extractTextFromPdf(buffer);
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await extractTextFromDocx(buffer);
    } else {
        text = extractTextFromTxt(buffer);
    }

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    const phoneMatch = text.match(/(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);

    // ✅ Get dynamic skill list
    const canonicalSkills = await getCachedSkills();

    // ✅ Match against dynamic skills
    const skills = extractSkills(text, canonicalSkills);

    return {
        name: undefined,
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        raw_text: text,
        skills,
    };
}
