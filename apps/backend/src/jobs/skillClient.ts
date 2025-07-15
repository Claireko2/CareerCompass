// apps/backend/src/jobs/skillClient.ts
import axios from 'axios';

const EXTRACTOR_URL = process.env.EXTRACTOR_URL || 'http://localhost:8000/extract';

export async function skillExtractor(text: string): Promise<{ skill_ids: number[] }> {
    try {
        const response = await axios.post(EXTRACTOR_URL, { text }, { timeout: 10_000 });
        return response.data; // { skill_ids: number[] }
    } catch (error) {
        console.error('Skill extraction failed:', error);
        return { skill_ids: [] }; // fallback empty list
    }
}
