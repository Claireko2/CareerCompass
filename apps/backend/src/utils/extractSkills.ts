import { findBestMatch } from 'string-similarity';

export interface CanonicalSkill {
    id: string;
    name: string;
}

export interface SkillMatch {
    skill_name: string;
    canonical_skill_id?: string;
    source: string;
}

function cleanSkillName(name: string): string {
    return name.toLowerCase().replace(/\s*\(.*?\)/g, '').trim();
}

function generateNGrams(words: string[], maxN: number = 4): string[] {
    const ngrams: string[] = [];
    for (let n = 1; n <= maxN; n++) {
        for (let i = 0; i <= words.length - n; i++) {
            const gram = words.slice(i, i + n).join(' ');
            ngrams.push(gram);
        }
    }
    return ngrams;
}

export function extractSkills(text: string, canonicalSkills: CanonicalSkill[]): SkillMatch[] {
    const start = Date.now();

    const lowerText = text.toLowerCase();

    // Pre-clean skill names and build map once (consider caching globally)
    const skillNameMap = new Map<string, CanonicalSkill>();
    const skillNamesCleaned: string[] = [];

    for (const skill of canonicalSkills) {
        const cleaned = cleanSkillName(skill.name);
        skillNameMap.set(cleaned, skill);
        skillNamesCleaned.push(cleaned);
    }

    // Generate n-grams (1 to 4 grams) from text words
    const words = lowerText.split(/\W+/).filter(Boolean);
    const ngrams = generateNGrams(words, 4);

    const threshold = 0.9;
    const matchedSkills: SkillMatch[] = [];
    const matchedSet = new Set<string>();

    // Pre-filter: create a Set of first words of skill names for quick lookup
    const skillPrefixes = new Set<string>();
    for (const skillName of skillNamesCleaned) {
        const firstWord = skillName.split(' ')[0];
        skillPrefixes.add(firstWord);
    }

    for (const ngram of ngrams) {
        const firstWord = ngram.split(' ')[0]; // Get the first word of the ngram

        // Quick check to skip ngrams that can't match any skill prefix
        if (!skillPrefixes.has(firstWord)) continue;

        // Filter skills that start with the same first word as the ngram
        const candidates = skillNamesCleaned.filter(s => s.startsWith(firstWord));
        if (candidates.length === 0) continue;

        const { bestMatch } = findBestMatch(ngram, candidates);

        if (bestMatch.rating >= threshold) {
            const matchedSkill = skillNameMap.get(bestMatch.target);
            if (matchedSkill && !matchedSet.has(matchedSkill.id)) {
                matchedSkills.push({
                    skill_name: matchedSkill.name,
                    canonical_skill_id: matchedSkill.id,
                    source: 'nlp+fuzzy',
                });
                matchedSet.add(matchedSkill.id);
            }
        }
    }

    console.log(`extractSkills optimized finished, took ${(Date.now() - start) / 1000}s`);
    return matchedSkills;
}
