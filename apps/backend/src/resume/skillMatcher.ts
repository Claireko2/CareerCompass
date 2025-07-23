// not in use currently
import { findBestMatch } from 'string-similarity';

const CANONICAL_SKILLS: Record<string, string> = {
    python: 'ONET:1234',
    sql: 'ONET:5678',
    'data analysis': 'ONET:9012',
    'microsoft excel': 'ONET:2345',
    'machine learning': 'ONET:6789',
    'power bi': 'ONET:1357',
    'pandas': 'ONET:1122',
    'scikit-learn': 'ONET:9988',
    'numpy': 'ONET:3344',
    'tableau': 'ONET:4455',
};

function generateNgrams(text: string, maxN = 3): string[] {
    const tokens = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const ngrams: string[] = [];

    for (let n = 1; n <= maxN; n++) {
        for (let i = 0; i <= tokens.length - n; i++) {
            ngrams.push(tokens.slice(i, i + n).join(' '));
        }
    }

    return Array.from(new Set(ngrams)); // remove duplicates
}


export function extractSkills(text: string) {
    const phrases = generateNgrams(text, 3);
    const matchedSkills = [];
    const threshold = 0.85; // you can tune this

    for (const phrase of phrases) {
        const { bestMatch } = findBestMatch(phrase, Object.keys(CANONICAL_SKILLS));
        if (bestMatch.rating >= threshold) {
            matchedSkills.push({
                skill_name: bestMatch.target,
                canonical_skill_id: CANONICAL_SKILLS[bestMatch.target],
                source: 'fuzzy-match',
            });
        }
    }

    return matchedSkills;
}
